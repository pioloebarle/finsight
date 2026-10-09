import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTransactionForUser } from "../../transactionService";
import type { TransactionInput } from "../../validation/transaction";
import { testPrisma, testPool } from "../../queries/__tests__/vitest-setup";

describe("createTransactionForUser", () => {
    let userId: string;
    let otherUserId: string;
    let categoryId: string;
    let otherCategoryId: string;

    beforeAll(async () => {
        const stamp = Date.now();

        const user = await testPrisma.user.create({
        data: {
            email: `tx-test-${stamp}@example.com`,
            passwordHash: "test-only",
        },
        });

        const otherUser = await testPrisma.user.create({
        data: {
            email: `tx-other-${stamp}@example.com`,
            passwordHash: "test-only",
        },
        });

        userId = user.id;
        otherUserId = otherUser.id;

        const category = await testPrisma.category.create({
        data: { userId, categoryName: "Test groceries" },
        });

        const otherCategory = await testPrisma.category.create({
        data: { userId: otherUserId, categoryName: "Private category" },
        });

        categoryId = category.id;
        otherCategoryId = otherCategory.id;
    });

    afterAll(async () => {
        // Deleting the users also deletes their test transactions and categories.
        await testPrisma.user.deleteMany({
        where: { id: { in: [userId, otherUserId] } },
        });

        await testPrisma.$disconnect();
        await testPool.end();
    });

    const makeInput = (
        overrides: Partial<TransactionInput> = {}
    ): TransactionInput => ({
        description: "Test transaction",
        amount: 150.5,
        type: "expense",
        date: "2026-10-09",
        categoryId,
        ...overrides,
    });

    it("stores expenses as negative centavos", async () => {
        const result = await createTransactionForUser(
        userId,
        makeInput({ description: "Test expense" }),
        testPrisma
        );

        expect(result.success).toBe(true);

        const saved = await testPrisma.transaction.findFirstOrThrow({
        where: { userId, description: "Test expense" },
        });

        expect(saved.amountCentavos).toBe(-15050);
        expect(saved.categoryId).toBe(categoryId);
        expect(saved.categorizedBy).toBe("USER");
        expect(saved.source).toBe("MANUAL");
    });

    it("stores income as positive centavos", async () => {
        const result = await createTransactionForUser(
        userId,
        makeInput({
            description: "Test income",
            amount: 25000,
            type: "income",
        }),
        testPrisma
        );

        expect(result.success).toBe(true);

        const saved = await testPrisma.transaction.findFirstOrThrow({
        where: { userId, description: "Test income" },
        });

        expect(saved.amountCentavos).toBe(2500000);
    });

    it("stores uncategorized transactions with null category fields", async () => {
        const result = await createTransactionForUser(
        userId,
        makeInput({
            description: "Test uncategorized",
            categoryId: undefined,
        }),
        testPrisma
        );

        expect(result.success).toBe(true);

        const saved = await testPrisma.transaction.findFirstOrThrow({
        where: { userId, description: "Test uncategorized" },
        });

        expect(saved.categoryId).toBeNull();
        expect(saved.categorizedBy).toBeNull();
    });

    it("rejects another user's category without creating a transaction", async () => {
        const before = await testPrisma.transaction.count({
        where: { userId },
        });

        const result = await createTransactionForUser(
        userId,
        makeInput({
            description: "Should not be saved",
            categoryId: otherCategoryId,
        }),
        testPrisma
        );

        expect(result.success).toBe(false);

        const after = await testPrisma.transaction.count({
        where: { userId },
        });

        expect(after).toBe(before);
    });

    it("rejects a category UUID that doesn't exist", async () => {
        const result = await createTransactionForUser(
        userId,
        makeInput({
            description: "Missing category",
            categoryId: "550e8400-e29b-41d4-a716-446655440000",
        }),
        testPrisma
        );

        expect(result.success).toBe(false);
    });
});

