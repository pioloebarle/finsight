import { z } from "zod";

const isValidDate = (value: string): boolean => {
    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

export const TRANSACTION_ID_ERROR_MESSAGE =
    "Invalid transaction ID format. Expected a UUID (e.g., 123e4567-e89b-12d3-a456-426614174000).";

export const transactionSchema = z.object({
    description: z
        .string()
        .trim()
        .min(1, "Description is required.")
        .max(20, "Description must be at most 20 characters long."),

        amount: z
            .number()
            .positive("Amount must be a positive number."),
        
        type: z
            .enum(["income", "expense"]),
        
        date: z
            .string()
            .regex(
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
                "Date must be in YYYY-MM-DD format"
            )
            .refine(isValidDate, "Invalid date. Please provide a valid date."),
        
        categoryId: z
            .string()
            .trim()
            .optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;