import { prisma } from "@repo/database";

export type LedgerEntrySummary = {
    id: string;
    walletId: string;
    amount: number;
    entryType: "CREDIT" | "DEBIT";
    refrenceId: string | null;
    createdAt: Date;
};

function toLedgerEntrySummary(row: {
    id: string;
    walletId: string;
    amount: number;
    entryType: string;
    refrenceId: string | null;
    createdAt: Date;
}): LedgerEntrySummary {
    return {
        id: row.id,
        walletId: row.walletId,
        amount: row.amount,
        entryType: row.entryType === "DEBIT" ? "DEBIT" : "CREDIT",
        refrenceId: row.refrenceId,
        createdAt: row.createdAt,
    };
}

export const getWalletByUserId = async (userId: string) => {
    return await prisma.wallet.findUnique({
        where: { userId },
    })
}

export const topUpWallet = async (userId: string, amount: number) => {
    const wallet = await getWalletByUserId(userId);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    return prisma.$transaction(async (tx) => {
        const created = await tx.ledgerEntry.create({
            data: {
                walletId: wallet.id,
                amount,
                entryType: "CREDIT"
            }
        })
        return toLedgerEntrySummary(created);
    })
}