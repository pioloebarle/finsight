import { describe, expect, it } from "vitest";
import { toTransactionRow } from "./transactions";

describe("toTransactionRow", () => {
    it("converts an expense from pesos to negative centavos", () => {
        const result = toTransactionRow({
            description: "Groceries",
            amount: 150.50,
            type: "expense",
            date: "2026-10-08",
            categoryId: "category-123",
        });

        expect(result.amountCentavos).toBe(-15050);
    });

    it("converts an income to positive centavos", () => {
        const result = toTransactionRow({
            description: "Salary",
            amount: 25000,
            type: "income",
            date: "2026-10-08",
            categoryId: "salary-123",
        });

        expect(result.amountCentavos).toBe(2500000);
    });

    it("rounds floating-point values correctly", () => {
        const result = toTransactionRow({
            description: "Test",
            amount: 0.1 + 0.2,
            type: "expense",
            date: "2026-10-08",
        });

        expect(result.amountCentavos).toBe(-30);
    });

    it("sets uncategorized transactions to null", () => {
        const result = toTransactionRow({
            description: "Random Purchase",
            amount: 50,
            type: "expense",
            date: "2026-10-08",
        });

        expect(result.categoryId).toBeNull();
        expect(result.categorizedBy).toBeNull();
    });

    it("marks manually categorized transactions as user categorized", () => {
        const result = toTransactionRow({
            description: "Groceries",
            amount: 150.50,
            type: "expense",
            date: "2026-10-08",
            categoryId: "category-123",
        });

        expect(result.categorizedBy).toBe("USER");
    });

    it("marks the transaction source as manual", () => {
        const result = toTransactionRow({
            description: "Groceries",
            amount: 150.50,
            type: "expense",
            date: "2026-10-08",
        });

        expect(result.source).toBe("MANUAL");
        expect(result.importHash).toBeNull();
    });
});