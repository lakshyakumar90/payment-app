import { api } from "./http";
import { z } from "zod";
import {
  AdminDeductAllWalletSchema,
  AdminDeductWalletSchema,
  AdminResetAllCachesWalletSchema,
  AdminResetCacheWalletSchema,
  AdminTopUpAllWalletSchema,
  AdminTopUpWalletSchema,
} from "@repo/zod-schemas";

export type LedgerEntrySummary = {
  id: string;
  walletId: string;
  amount: number;
  entryType: "CREDIT" | "DEBIT";
  refrenceId: string | null;
  /** Express JSON serialization; returned as ISO string. */
  createdAt: string;
};

export type AdminTopUpBody = z.infer<typeof AdminTopUpWalletSchema>;
export type AdminDeductBody = z.infer<typeof AdminDeductWalletSchema>;
export type AdminResetCacheBody = z.infer<typeof AdminResetCacheWalletSchema>;
export type AdminTopUpAllBody = z.infer<typeof AdminTopUpAllWalletSchema>;
export type AdminDeductAllBody = z.infer<typeof AdminDeductAllWalletSchema>;
export type AdminResetAllCachesBody = z.infer<typeof AdminResetAllCachesWalletSchema>;

export type AdminTopUpResponse = {
  wallet: LedgerEntrySummary;
};

export type AdminDeductResponse = {
  wallet: LedgerEntrySummary;
};

export type AdminResetCacheResponse = {
  wallet: { success: true; message: string };
};

export type AdminTopUpAllResponse = {
  affectedCount: number;
  amount: number;
};

export type AdminDeductAllResponse = {
  affectedCount: number;
  amount: number;
};

export type AdminResetAllCachesResponse = {
  updatedCount: number;
};

export async function adminTopUpWallet(
  body: AdminTopUpBody,
): Promise<AdminTopUpResponse> {
  const { data } = await api.post<AdminTopUpResponse>(
    "/wallet/admin/top-up",
    body,
  );
  return data;
}

export async function adminDeductWallet(
  body: AdminDeductBody,
): Promise<AdminDeductResponse> {
  const { data } = await api.post<AdminDeductResponse>(
    "/wallet/admin/deduct",
    body,
  );
  return data;
}

export async function adminResetCacheWallet(
  body: AdminResetCacheBody,
): Promise<AdminResetCacheResponse> {
  const { data } = await api.post<AdminResetCacheResponse>(
    "/wallet/admin/reset-cache",
    body,
  );
  return data;
}

export async function adminTopUpAllWallet(
  body: AdminTopUpAllBody,
): Promise<AdminTopUpAllResponse> {
  const { data } = await api.post<AdminTopUpAllResponse>(
    "/wallet/admin/top-up-all",
    body,
  );
  return data;
}

export async function adminDeductAllWallet(
  body: AdminDeductAllBody,
): Promise<AdminDeductAllResponse> {
  const { data } = await api.post<AdminDeductAllResponse>(
    "/wallet/admin/deduct-all",
    body,
  );
  return data;
}

export async function adminResetAllCachesWallet(): Promise<AdminResetAllCachesResponse> {
  const body = {} satisfies AdminResetAllCachesBody;
  const { data } = await api.post<AdminResetAllCachesResponse>(
    "/wallet/admin/reset-all-caches",
    body,
  );
  return data;
}