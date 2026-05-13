import type { Axios, AxiosResponse } from "axios";
import { api } from "./http";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string | "ADMIN" | "USER";
};

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export async function login(body: LoginBody): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse, AxiosResponse<LoginResponse>>(
    "/auth/login",
    body,
  );
  return data;
}

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const { data } = await api.post<
    RegisterResponse,
    AxiosResponse<RegisterResponse>
  >("/auth/register", body);
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse, AxiosResponse<MeResponse>>(
    "/auth/me",
  );
  return data;
}

export async function refreshToken(): Promise<string> {
  const { data } = await api.post<{accessToken: string}>(
    "/auth/refresh-token",
    {},
  );
  return data.accessToken;
}

export async function logout(): Promise<void> {
  await api.post<void, AxiosResponse<void>>("/auth/logout");
}
