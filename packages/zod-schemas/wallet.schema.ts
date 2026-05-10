import { z } from "zod";

export const TopUpWalletSchema = z.object({
    amount: z.number().positive(),
});

