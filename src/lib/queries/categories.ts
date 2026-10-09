import { prisma } from "@/lib/prisma";

export type CategoryOptions = { id: string; categoryName: string };

export async function getCategories(userId: string): Promise<CategoryOptions[]> {
    return prisma.category.findMany({
        where: { userId },
        orderBy: { categoryName: "asc" },
        select: {
            id: true,
            categoryName: true,
        },
    })
}