import { prisma } from "@repo/database";
import { interactiveTransactionDefaults } from "../../utils/prisma-transaction.js";

export type LedgerEntrySummary = {
    id: string;
    walletId: string;
    amount: number;
    entryType: "CREDIT" | "DEBIT";
    refrenceId: string | null;
    createdAt: Date;
};

type LedgerDb = Pick<typeof prisma, "ledgerEntry">;

/** Sum(CREDIT amounts) − Sum(DEBIT amounts) for a wallet — source of truth for available funds. */
export async function sumLedgerBalance(
    db: LedgerDb,
    walletId: string,
): Promise<number> {
    const rows = await db.ledgerEntry.groupBy({
        by: ["entryType"],
        where: { walletId },
        _sum: { amount: true },
    });

    let credits = 0;
    let debits = 0;
    for (const row of rows) {
        const sum = row._sum.amount ?? 0;
        if (row.entryType === "CREDIT") credits += sum;
        if (row.entryType === "DEBIT") debits += sum;
    }
    return credits - debits;
}

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

async function findWalletRowByUserId(userId: string) {
    return prisma.wallet.findUnique({
        where: { userId },
    });
}

export const getWalletByUserId = async (userId: string) => {
    return prisma.$transaction(
        async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });

            if (!wallet) return null;

            const ledgerBalance = await sumLedgerBalance(tx, wallet.id);

            const row =
                wallet.cachedBalance !== ledgerBalance
                    ? await tx.wallet.update({
                          where: { id: wallet.id },
                          data: { cachedBalance: ledgerBalance },
                      })
                    : wallet;

            return { ...row, ledgerBalance };
        },
        interactiveTransactionDefaults,
    );
};

export const topUpWallet = async (userId: string, amount: number) => {
    const wallet = await findWalletRowByUserId(userId);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    return prisma.$transaction(
        async (tx) => {
            const created = await tx.ledgerEntry.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    entryType: "CREDIT",
                },
            });

            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    cachedBalance: {
                        increment: amount,
                    },
                },
            });
            return toLedgerEntrySummary(created);
        },
        interactiveTransactionDefaults,
    );
};
