import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getCategories } from "../categories";
import { testPrisma, testPool } from "./vitest-setup";

describe("getCategories", () => {
    let userId: string;
    let otherUserId: string;
    let emptyUserId: string;

    beforeAll(async () => {
        const stamp = Date.now();
        const user = await testPrisma.user.create({ data: { email: `cat-${stamp}@example.com`, passwordHash: "x" } });
        const other = await testPrisma.user.create({ data: { email: `cat-other-${stamp}@example.com`, passwordHash: "x" } });
        const empty = await testPrisma.user.create({ data: { email: `cat-empty-${stamp}@example.com`, passwordHash: "x" } });
        userId = user.id;
        otherUserId = other.id;
        emptyUserId = empty.id;

        await testPrisma.category.createMany({
            data: [
                { userId, categoryName: "Grocery" },
                { userId, categoryName: "Bills" },
                { userId, categoryName: "Salary" },
                { userId: otherUserId, categoryName: "Other's category" },
            ],
        });
    });

    afterAll(async () => {
        await testPrisma.user.delete({ where: { id: userId } });
        await testPrisma.user.delete({ where: { id: otherUserId } });
        await testPrisma.user.delete({ where: { id: emptyUserId } });
        await testPrisma.$disconnect();
        await testPool.end();
    });

    it("returns the user's categories in alphabetical order", async () => {
        const result = await getCategories(userId);
        expect(result.map((r) => r.categoryName)).toEqual(["Bills", "Grocery", "Salary"]);
    });

    it("never returns another user's categories", async () => {
        const result = await getCategories(userId);
        expect(result.map((r) => r.categoryName)).not.toContain("Other's category");
    });

    it("returns real UUIDs for the ids", async () => {
        const result = await getCategories(userId);
        expect(result[0].id).toMatch(/^[0-9a-f-]{36}$/);
    })

    it("returns an empty list for a user with no categories", async () => {
        const result = await getCategories(emptyUserId);
        expect(result).toEqual([]);
    });

});