import { prisma, Prisma } from "@repo/database";
import { interactiveTransactionDefaults } from "../../utils/prisma-transaction.js";
import { sumLedgerBalance } from "../wallet/wallet.service.js";

export const transaction = async (
    senderId: string,
    receiverId: string,
    amount: number,
) => {
    if (senderId === receiverId) {
        return {
            success: false,
            message: "Cannot transfer to yourself",
        };
    }

    try {
        return await prisma.$transaction(
            async (tx) => {
                const senderWallet = await tx.wallet.findUnique({
                    where: { userId: senderId },
                });
                const receiverWallet = await tx.wallet.findUnique({
                    where: { userId: receiverId },
                });

                if (!senderWallet || !receiverWallet) {
                    return {
                        success: false,
                        message: "Wallet not found",
                    };
                }

                const available = await sumLedgerBalance(tx, senderWallet.id);
                if (available < amount) {
                    return {
                        success: false,
                        message: "Insufficient balance",
                    };
                }

                await tx.ledgerEntry.create({
                    data: {
                        walletId: senderWallet.id,
                        amount,
                        entryType: "DEBIT",
                        refrenceId: receiverId,
                    },
                });

                await tx.ledgerEntry.create({
                    data: {
                        walletId: receiverWallet.id,
                        amount,
                        entryType: "CREDIT",
                        refrenceId: senderId,
                    },
                });

                await tx.wallet.update({
                    where: { id: senderWallet.id },
                    data: {
                        cachedBalance: {
                            decrement: amount,
                        },
                    },
                });

                await tx.wallet.update({
                    where: { id: receiverWallet.id },
                    data: {
                        cachedBalance: {
                            increment: amount,
                        },
                    },
                });

                return {
                    success: true,
                    message: "Transaction successful",
                };
            },
            {
                ...interactiveTransactionDefaults,
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            },
        );
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2034"
        ) {
            return {
                success: false,
                message: "Concurrent update conflict, please try again",
            };
        }
        throw error;
    }
};
