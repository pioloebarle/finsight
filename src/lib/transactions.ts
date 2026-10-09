import type { TransactionInput } from "@/lib/validation/transaction";

export function toTransactionRow(input: TransactionInput) {
    const amountCentavos = Math.round(input.amount * 100);

    return {
        transactionDate: new Date(`${input.date}T00:00:00.000Z`),
        amountCentavos: 
            input.type === "expense" ? -amountCentavos : amountCentavos,
        description: input.description,
        categoryId: input.categoryId ?? null, 
        categorizedBy: input.categoryId ? "USER" as const : null,
        source: "MANUAL" as const,
        importHash: null, 
    }
}