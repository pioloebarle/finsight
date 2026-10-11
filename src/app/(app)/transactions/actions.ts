"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validation/transaction";
import { toTransactionRow } from "@/lib/transactions";
import type { CreateTransactionResult } from "@/types/dashboard"
import { createTransactionForUser } from "@/lib/transactionService";

export async function createTransaction(formData: FormData): Promise<CreateTransactionResult> {
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
        const serviceResult = await createTransactionForUser(
            userId,
            result.data
        );

        if (!serviceResult.success) {
            return serviceResult;
        }

        revalidatePath("/dashboard");

        return serviceResult;
        } catch (error) {
            console.error("Failed to create transaction:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
    }

}