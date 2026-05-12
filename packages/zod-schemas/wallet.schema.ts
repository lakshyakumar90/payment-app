import { z } from "zod";

export const AdminTopUpWalletSchema = z.object({
    amount: z.number().positive(),
    userId: z.string().uuid(),
});

