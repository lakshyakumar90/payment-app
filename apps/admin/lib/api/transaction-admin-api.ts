import { api } from "./http";
import { z } from "zod";
import { AdminTransferBetweenUsersSchema } from "@repo/zod-schemas";

export type AdminTransferBody = z.infer<typeof AdminTransferBetweenUsersSchema>;

export type TransactionResult = {
  success: boolean;
  message: string;
};

export type AdminTransferResponse = {
  transactionResult: TransactionResult;
};

export async function adminTransferBetweenUsers(
  body: AdminTransferBody,
): Promise<AdminTransferResponse> {
  const { data } = await api.post<AdminTransferResponse>(
    "/transaction/admin/transfer",
    body,
  );
  return data;
}

