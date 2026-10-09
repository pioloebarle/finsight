import { describe, expect, it } from "vitest";
import { transactionSchema } from "./transaction";

const validTransaction = {
    description: "Groceries",
    amount: 150.5,
    type: "expense",
    date: "2026-10-09",
    categoryId: "550e8400-e29b-41d4-a716-446655440000",
};

describe("transactionSchema", () => {
    it("accepts a valid expense", () => {
        expect(transactionSchema.safeParse(validTransaction).success).toBe(true);
    });

    it("rejects an empty or whitespace-only description", () => {
        for (const description of ["", "   "]) {
        expect(
            transactionSchema.safeParse({ ...validTransaction, description }).success
        ).toBe(false);
        }
    });

    it("accepts a 50-character description and rejects 31 characters", () => {
        expect(transactionSchema.safeParse({...validTransaction, description: "a".repeat(50),}).success).toBe(true);

        expect(transactionSchema.safeParse({...validTransaction, description: "a".repeat(51),}).success).toBe(false);
    });

    it.each([0, -1, 150.555, 99_999_999])(
        "rejects invalid amount %s",
        (amount) => {
        expect(
            transactionSchema.safeParse({ ...validTransaction, amount }).success
        ).toBe(false);
        }
    );

    it("accepts an amount with two decimal places", () => {
        expect(
        transactionSchema.safeParse({
            ...validTransaction,
            amount: 150.55,
        }).success
        ).toBe(true);
    });

    it.each(["2026-02-30", "2026-13-01", "banana"])(
        "rejects invalid date %s",
        (date) => {
        expect(
            transactionSchema.safeParse({ ...validTransaction, date }).success
        ).toBe(false);
        }
    );

    it("rejects an unsupported transaction type", () => {
        expect(
        transactionSchema.safeParse({
            ...validTransaction,
            type: "other",
        }).success
        ).toBe(false);
    });

    it("rejects a category ID that isn't a UUID", () => {
        expect(
        transactionSchema.safeParse({
            ...validTransaction,
            categoryId: "not-a-uuid",
        }).success
        ).toBe(false);
    });

    it("allows a transaction without a category", () => {
        const uncategorized = {
            ...validTransaction,
            categoryId: undefined,
        };

        expect(transactionSchema.safeParse(uncategorized).success).toBe(true);
    });
});

