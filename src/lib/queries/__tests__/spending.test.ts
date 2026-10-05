import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getSpendingByCategory } from "../spending";
import { testPrisma, testPool } from "./vitest-setup";

describe("getSpendingByCategory Integration Tests", () => {
  let testUserId: string;
  let foodCategoryId: string;
  let billsCategoryId: string;

  // 1. Setup isolated data before running assertions
  beforeAll(async () => {
    // Create a strict isolated test user
    const user = await testPrisma.user.create({
      data: {
        email: `test-runner-${Date.now()}@example.com`,
        passwordHash: "securehash",
      },
    });
    testUserId = user.id;

    // Create testing categories assigned to this user
    const food = await testPrisma.category.create({
      data: { categoryName: "Food Test", userId: testUserId },
    });
    const bills = await testPrisma.category.create({
      data: { categoryName: "Bills Test", userId: testUserId },
    });

    foodCategoryId = food.id;
    billsCategoryId = bills.id;

    // Seed predictable transactional test targets (Target testing month: October 2026)
    await testPrisma.transaction.createMany({
      data: [
        // Correct total match case
        { userId: testUserId, transactionDate: new Date("2026-10-15"), amountCentavos: -5000, description: "Lunch", categoryId: foodCategoryId, source: "MANUAL" },
        { userId: testUserId, transactionDate: new Date("2026-10-20"), amountCentavos: -2500, description: "Dinner", categoryId: foodCategoryId, source: "MANUAL" },

        // Uncategorized expense total group case (categoryId: null)
        { userId: testUserId, transactionDate: new Date("2026-10-10"), amountCentavos: -3000, description: "Cash Expense", categoryId: null, source: "MANUAL" },

        // Income evaluation exclusion case (positive values should be ignored)
        { userId: testUserId, transactionDate: new Date("2026-10-01"), amountCentavos: 500000, description: "Paycheck", categoryId: billsCategoryId, source: "IMPORT" },

        // Date range window bounds checking cases
        { userId: testUserId, transactionDate: new Date("2026-10-01"), amountCentavos: -1000, description: "Lower Edge Bounds", categoryId: billsCategoryId, source: "MANUAL" }, // ✅ Should be included
        { userId: testUserId, transactionDate: new Date("2026-10-31"), amountCentavos: -2000, description: "Upper Edge Bounds", categoryId: billsCategoryId, source: "MANUAL" }, // ✅ Should be included
        { userId: testUserId, transactionDate: new Date("2026-09-30"), amountCentavos: -9999, description: "September Out of Bounds", categoryId: billsCategoryId, source: "MANUAL" }, 
        { userId: testUserId, transactionDate: new Date("2026-11-01"), amountCentavos: -8888, description: "November Out of Bounds", categoryId: billsCategoryId, source: "MANUAL" }, 
      ],
    });
  });

  // 2. Tear down everything immediately using cascading deletes
  afterAll(async () => {
    if (testUserId) {
      await testPrisma.user.delete({ where: { id: testUserId } });
    }
    await testPrisma.$disconnect();
    await testPool.end();
  });

  it("calculates the correct total for a designated category and excludes positive incomes", async () => {
    const targetMonth = new Date("2026-10-15");
    const results = await getSpendingByCategory(testUserId, targetMonth);

    // Food Test should equal exactly -5000 + -2500 = -7500 centavos
    const foodGroup = results.find((r) => r.categoryId === foodCategoryId);
    expect(foodGroup).toBeDefined();
    expect(foodGroup?.totalCentavos).toBe(-7500);

    // Bills Test has an income (+500000) and two expenses (-1000 and -2000). Total must ignore income and sum to -3000
    const billsGroup = results.find((r) => r.categoryId === billsCategoryId);
    expect(billsGroup).toBeDefined();
    expect(billsGroup?.totalCentavos).toBe(-3000);
  });

  it("gathers uncategorized null items under their own explicit group name row", async () => {
    const targetMonth = new Date("2026-10-05");
    const results = await getSpendingByCategory(testUserId, targetMonth);

    const nullGroup = results.find((r) => r.categoryId === null);
    expect(nullGroup).toBeDefined();
    expect(nullGroup?.categoryName).toBe("Uncategorized");
    expect(nullGroup?.totalCentavos).toBe(-3000);
  });

  it("returns an completely empty list if a month contains zero recorded transaction footprints", async () => {
    // December 2026 has no testing rows generated above
    const emptyMonth = new Date("2026-12-01");
    const results = await getSpendingByCategory(testUserId, emptyMonth);

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(0);
  });
});
