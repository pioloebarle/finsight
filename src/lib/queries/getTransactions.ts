
import { prisma } from "../prisma";
import { monthRange } from "../validation/month";

export type TransactionRecord = {
    id: string;
    description: string;
    amountCentavos: number;
    transactionDate: Date;
    categoryName: string | null;
};

export type TransactionDateRange =
    | "thisMonth"
    | "7days"
    | "30days"
    | "thisYear"
    | "allTime";

export async function getTransactions(
    userId: string,
    month: Date,
    dateRange: TransactionDateRange = "thisMonth",
): Promise<TransactionRecord[]> {
    let dateFilter: { gte?: Date; lt?: Date } | undefined;

    if (dateRange === "thisMonth") {
        const { start, end } = monthRange(month);
        dateFilter = { gte: start, lt: end };
    } else if (dateRange === "7days" || dateRange === "30days") {
        const now = new Date();

        const today = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
            ),
        );

        const start = new Date(today);
        start.setUTCDate(
            today.getUTCDate() - (dateRange === "7days" ? 6 : 29),
        );

        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        dateFilter = {
            gte: start,
            lt: tomorrow,
        };
    } else if (dateRange === "thisYear") {
        const now = new Date();
        const year = now.getUTCFullYear();

        dateFilter = {
            gte: new Date(Date.UTC(year, 0, 1)),
            lt: new Date(Date.UTC(year + 1, 0, 1)),
        };
    }
    
    const dateStats = await prisma.transaction.aggregate({
        where: { userId },
        _min: { transactionDate: true },
        _max: { transactionDate: true },
        _count: { _all: true },
    });

    console.log("Transaction date stats:", {
        total: dateStats._count._all,
        earliest: dateStats._min.transactionDate,
        latest: dateStats._max.transactionDate,
    });


    const rows = await prisma.transaction.findMany({
        where: {
            userId,
            ...(dateFilter ? { transactionDate: dateFilter } : {}),
        },
        orderBy: [
            { transactionDate: "desc" },
            { createdAt: "desc" },
            { id: "desc" },
        ],
        select: {
            id: true,
            description: true,
            amountCentavos: true,
            transactionDate: true,
            category: {
                select: {
                    categoryName: true,
                },
            },
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
