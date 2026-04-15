import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api/v1";
const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;

  if (typeof window !== "undefined") {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    // Axios may start with undefined headers; normalize before setting.
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  queue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve(token);
  });
  queue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as any).Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data.accessToken;
        setAccessToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as any).Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
