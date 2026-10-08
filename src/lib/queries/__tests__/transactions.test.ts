import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getRecentTransactions } from "../transactions";
import { testPrisma, testPool } from "./vitest-setup";

describe("getRecentTransactions", () => {
  let userId: string;
  let otherUserId: string;

  beforeAll(async () => {
    const user = await testPrisma.user.create({
      data: { email: `recent-${Date.now()}@example.com`, passwordHash: "x" },
    });
    const other = await testPrisma.user.create({
      data: { email: `recent-other-${Date.now()}@example.com`, passwordHash: "x" },
    });
    userId = user.id;
    otherUserId = other.id;

    const food = await testPrisma.category.create({ data: { userId, categoryName: "Food Recent" } });

    await testPrisma.transaction.createMany({
      data: [
        { userId, transactionDate: new Date("2026-10-05"), amountCentavos: -1000, description: "Oldest", categoryId: food.id, source: "MANUAL" },
        { userId, transactionDate: new Date("2026-10-20"), amountCentavos: -2000, description: "Newest expense", categoryId: food.id, source: "MANUAL" },
        { userId, transactionDate: new Date("2026-10-15"), amountCentavos: 500000, description: "Paycheck", categoryId: null, source: "MANUAL" },
        { userId, transactionDate: new Date("2026-09-30"), amountCentavos: -9999, description: "September row", categoryId: null, source: "MANUAL" },
        { userId, transactionDate: new Date("2026-11-01"), amountCentavos: -8888, description: "November row", categoryId: null, source: "MANUAL" },
        // belongs to someone else, in the same month
        { userId: otherUserId, transactionDate: new Date("2026-10-25"), amountCentavos: -7777, description: "Other user's row", categoryId: null, source: "MANUAL" },
      ],
    });
  });

  afterAll(async () => {
    await testPrisma.user.delete({ where: { id: userId } });
    await testPrisma.user.delete({ where: { id: otherUserId } });
    await testPrisma.$disconnect();
    await testPool.end();
  });

  const october = new Date("2026-10-15");

  it("returns the month's transactions newest first, income included", async () => {
    const rows = await getRecentTransactions(userId, october);
    expect(rows.map((r) => r.description)).toEqual(["Newest expense", "Paycheck", "Oldest"]);
    expect(rows[1].amountCentavos).toBe(500000); // income stays positive
  });

  it("excludes other months", async () => {
    const rows = await getRecentTransactions(userId, october);
    const names = rows.map((r) => r.description);
    expect(names).not.toContain("September row");
    expect(names).not.toContain("November row");
  });

  it("never returns another user's rows", async () => {
    const rows = await getRecentTransactions(userId, october);
    expect(rows.map((r) => r.description)).not.toContain("Other user's row");
  });

  it("respects the limit", async () => {
    const rows = await getRecentTransactions(userId, october, 2);
    expect(rows).toHaveLength(2);
  });

  it("returns category name, or null when uncategorized", async () => {
    const rows = await getRecentTransactions(userId, october);
    expect(rows.find((r) => r.description === "Newest expense")?.categoryName).toBe("Food Recent");
    expect(rows.find((r) => r.description === "Paycheck")?.categoryName).toBeNull();
  });

  it("returns an empty list for a month with no transactions", async () => {
    expect(await getRecentTransactions(userId, new Date("2026-12-01"))).toEqual([]);
  });
});