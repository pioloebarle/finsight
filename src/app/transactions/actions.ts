"use server";

import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validation/transaction";
import { toTransactionRow } from "@/lib/transactions";

export async function createTransaction(formData: FormData) {
    const userId = process.env.DEV_USER_ID;
    if(!userId) throw new Error("DEV_USER_ID is not set in environment variables.");

    const rawData = {
        description: formData.get("description"),
        amount: Number(formData.get("amount")),
        type: formData.get("type"),
        date: formData.get("date"),
        categoryId: formData.get("categoryId") || undefined,
    };

    const result = transactionSchema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    const transactionRow = toTransactionRow(result.data);

    await prisma.transaction.create({
        data: {
            userId,
            ...transactionRow,
        },
    });

    return {
        success: true,
    };
}