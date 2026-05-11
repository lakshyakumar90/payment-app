import { z } from "zod";

export const TransactionSchema = z.object({
    receiverId: z.uuid({ message: "Receiver ID must be a valid UUID" }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
})