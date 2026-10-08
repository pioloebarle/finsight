import { prisma } from "../prisma";
import { monthRange } from "../validation/month";

export type RecentTransaction = {
    id: string;
    description: string;
    amountCentavos: number;
    transactionDate: Date;
    categoryName: string | null;
};

export async function getRecentTransactions(
    userId: string,
    month: Date,
    limit = 5
): Promise<RecentTransaction[]> {
    const take = Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 50) : 5;
    const { start, end } = monthRange(month);

    const rows = await prisma.transaction.findMany({
        where: {
            userId,
            transactionDate: { gte: start, lt: end},
        },
        orderBy: [
            { transactionDate: "desc"},
            { createdAt: "desc"},
            { id: "desc" },
        ],
        take,
        select: {
            id: true,
            description: true,
            amountCentavos: true,
            transactionDate: true,
            category: { select: { categoryName: true } },
        },
    });

    return rows.map((row) => ({
        id: row.id,
        description: row.description,
        amountCentavos: row.amountCentavos,
        transactionDate: row.transactionDate,
        categoryName: row.category?.categoryName ?? null,
    }));
}