import { z } from "zod";
import { monetaryAmountSchema } from "./common.schema.js";

export const TransactionSchema = z.object({
    receiverId: z.uuid({ message: "Receiver ID must be a valid UUID" }),
    amount: monetaryAmountSchema,
});

export const AdminTransferBetweenUsersSchema = z.object({
    fromUserId: z.uuid({ message: "From User ID must be a valid UUID" }),
    toUserId: z.uuid({ message: "To User ID must be a valid UUID" }),
    amount: monetaryAmountSchema,
});
