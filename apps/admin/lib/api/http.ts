import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_V1_URL } from "./config";
import { getAccessToken, setAccessToken } from "./access-token";
import { error } from "console";

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let falledQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  falledQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  falledQueue = [];
}

export const api: AxiosInstance = axios.create({
  baseURL: API_V1_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!original) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = original.url ?? "";

    if (status != 401 || original._retry) {
      return Promise.reject(error);
    }

    if (url.includes("/auth/refresh")) {
      setAccessToken(null);
      processQueue(error, null);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        falledQueue.push({
          resolve: (newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${API_V1_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      setAccessToken(null);
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
