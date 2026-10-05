import { prisma } from "../prisma";

export async function getSpendingByCategory(userId: string, month: Date) {

    const year = month.getUTCFullYear();
    const monthIndex = month.getUTCMonth();

    const startOfMonth = new Date(Date.UTC(year, monthIndex, 1));
    const endOfMonth = new Date(Date.UTC(year, monthIndex + 1, 1));

    const result = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
            userId: userId,
            amountCentavos: { lt: 0 },
            transactionDate: {
                gte: startOfMonth,
                lt: endOfMonth
            },
        },
        _sum: {
            amountCentavos: true,
        },
    });

    const userCategories = await prisma.category.findMany({
        where: { userId: userId },
    });

    const categoryMap = new Map(userCategories.map(cat => [cat.id, cat.categoryName]));


    return result.map((group) => {
        const categoryId = group.categoryId;
        const categoryName = categoryId ? (categoryMap.get(categoryId) ?? "Unknown") : "Uncategorized";

        return {
        categoryId,
        categoryName,
        totalCentavos: group._sum.amountCentavos ?? 0, // Returns raw integer centavos
        };
  });
}