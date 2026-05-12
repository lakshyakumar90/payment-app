import { z } from "zod";
import { monetaryAmountSchema } from "./common.schema.js";

export const AdminTopUpWalletSchema = z.object({
    amount: monetaryAmountSchema,
    userId: z.string().uuid(),
});

