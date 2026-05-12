import { z } from "zod";
import { monetaryAmountSchema } from "./common.schema.js";

export const AdminTopUpWalletSchema = z.object({
    amount: monetaryAmountSchema,
    userId: z.string().uuid(),
});

export const AdminDeductWalletSchema = z.object({
    amount: monetaryAmountSchema,
    userId: z.string().uuid(),
});

export const AdminResetCacheWalletSchema = z.object({
    userId: z.string().uuid(),
});

/** Admin-only: no body fields; rejects unknown keys if client sends any. */
export const AdminResetAllCachesWalletSchema = z.object({}).strict();

/** Admin-only: same amount credited to every wallet. */
export const AdminTopUpAllWalletSchema = z.object({
    amount: monetaryAmountSchema,
});

/** Admin-only: same amount debited from every wallet (ledger + cache, same pattern as single-wallet deduct). */
export const AdminDeductAllWalletSchema = z.object({
    amount: monetaryAmountSchema,
});
