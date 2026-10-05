import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getSpendingByCategory(userId: string, month: Date) {

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
            userId: userId,
            amountCentavos: { lt: 0 },
            transactionDate: {
                gte: startOfMonth,
                lte: endOfMonth
            },
        },
        _sum: {
            amountCentavos: true,
        },
    });
    return result.map((group) => ({
        categoryId: group.categoryId,
        totalCentavos: group._sum.amountCentavos ?? 0,
    }));
}