"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validation/transaction";
import { toTransactionRow } from "@/lib/transactions";

export async function createTransaction(formData: FormData) {
    const userId = process.env.DEV_USER_ID;
    
    if(!userId){
        return {
            success: false,
            message: "Server Configuration Error. Please try again.",
        };
    }

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
            message: "Please check your transaction details",
            errors: result.error.flatten().fieldErrors,
        };
    }

    try {
        if (result.data.categoryId) {
            const category = await prisma.category.findFirst({
                where: {
                    id: result.data.categoryId,
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

        const transactionRow = toTransactionRow(result.data);

        await prisma.transaction.create({
            data: {
                userId,
                ...transactionRow,
            },
        });

        revalidatePath("/dashboard");

        return {
            success: true,
        };
    } catch (error) {
        console.error("Failed to create transaction:", error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }

}