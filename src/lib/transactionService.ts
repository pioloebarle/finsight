import { prisma } from "@/lib/prisma"; 
import { toTransactionRow } from "@/lib/transactions"; 
import type { TransactionInput } from "@/lib/validation/transaction"; 

type TransactionDatabase = typeof prisma;

export type CreateTransactionServiceResult = | { success: true; description: string; amountCentavos: number; } | { success: false; message: string; };

export async function createTransactionForUser(
    userId: string,
    input: TransactionInput,
    db: TransactionDatabase = prisma
): Promise<CreateTransactionServiceResult>{
    if (input.categoryId) {
        const category = await db.category.findFirst({
            where: {
                id: input.categoryId,
                userId,
            },
            select: { id: true },
        });
        if (!category) {
            return {
                success: false,
                message: "Invalid category selected. Please try again.",
            };
        }
    }

    const transactionRow = toTransactionRow(input);

    await db.transaction.create({
        data: {
            userId,
            ...transactionRow,
        },
    });

    return {
        success: true,
        description: input.description,
        amountCentavos: transactionRow.amountCentavos,
    };
}
