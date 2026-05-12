import { z } from "zod";

export const TransactionSchema = z.object({
    receiverId: z.uuid({ message: "Receiver ID must be a valid UUID" }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
})

export const AdminTransferBetweenUsersSchema = z.object({
    fromUserId: z.uuid({ message: "From User ID must be a valid UUID" }),
    toUserId: z.uuid({ message: "To User ID must be a valid UUID" }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
})