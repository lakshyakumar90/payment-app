import { api } from "./http";
import type { AxiosResponse } from "axios";

export type AdminUserOption = {
  id: string;
  name: string;
  email: string;
};

type SearchUsersResponse = {
  users: AdminUserOption[];
};

export async function searchUsersAdmin(
  query: string,
  limit = 10,
): Promise<AdminUserOption[]> {
  const { data } = await api.get<SearchUsersResponse, AxiosResponse<SearchUsersResponse>>(
    "/auth/admin/users/search",
    { params: { query, limit } },
  );
  return data.users;
}

