
import { describe, expect, it } from "vitest";
import {
  filterTransactions,
  INITIAL_FILTERS,
  type Transaction,
  type TransactionFilters,
} from "../../filterTransactions";

const createTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: "1",
  description: "Grocery shopping",
  categoryName: "grocery",
  amountCentavos: -15000,
  transactionDate: new Date("2026-10-05T00:00:00.000Z"),
  ...overrides,
});

const transactions: Transaction[] = [
  createTransaction({
    id: "1",
    description: "Grocery shopping",
    categoryName: "grocery",
    amountCentavos: -15000,
    transactionDate: new Date("2026-10-05T00:00:00.000Z"),
  }),
  createTransaction({
    id: "2",
    description: "Monthly salary",
    categoryName: "salary",
    amountCentavos: 5000000,
    transactionDate: new Date("2026-10-03T00:00:00.000Z"),
  }),
  createTransaction({
    id: "3",
    description: "Internet bill",
    categoryName: "internet",
    amountCentavos: -250000,
    transactionDate: new Date("2026-09-25T00:00:00.000Z"),
  }),
  createTransaction({
    id: "4",
    description: "Coffee with friends",
    categoryName: "food",
    amountCentavos: -12000,
    transactionDate: new Date("2026-09-15T00:00:00.000Z"),
  }),
  createTransaction({
    id: "5",
    description: "Freelance payment",
    categoryName: "salary",
    amountCentavos: 1000000,
    transactionDate: new Date("2026-08-20T00:00:00.000Z"),
  }),
  createTransaction({
    id: "6",
    description: "Uncategorized purchase",
    categoryName: null,
    amountCentavos: -5000,
    transactionDate: new Date("2026-10-01T00:00:00.000Z"),
  }),
  createTransaction({
    id: "7",
    description: "Zero amount transaction",
    categoryName: "uncategorized",
    amountCentavos: 0,
    transactionDate: new Date("2026-10-02T00:00:00.000Z"),
  }),
];

const applyFilters = (
  overrides: Partial<TransactionFilters> = {},
  referenceDate = new Date("2026-10-06T12:00:00.000Z"),
) => {
  const filters: TransactionFilters = {
    ...INITIAL_FILTERS,
    dateRange: "all",
    ...overrides,
  };

  // The reference date is passed only if your utility supports it.
  return filterTransactions(transactions, filters, referenceDate);
};

describe("filterTransactions", () => {
  describe("initial filters", () => {
    it("sets the expected default filters", () => {
      expect(INITIAL_FILTERS).toEqual({
        search: "",
        type: "all",
        category: "all",
        dateRange: "thisMonth",
        sortOrder: "newest",
      });
    });

    it("returns all transactions when no filters are applied", () => {
      const result = applyFilters();

      expect(result).toHaveLength(transactions.length);
    });
  });

  describe("search filtering", () => {
    it("filters transactions by description", () => {
      const result = applyFilters({ search: "grocery" });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("filters transactions by category name", () => {
      const result = applyFilters({ search: "internet" });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("3");
    });

    it("ignores letter casing when searching", () => {
      const result = applyFilters({ search: "MONTHLY SALARY" });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("trims whitespace from the search term", () => {
      const result = applyFilters({ search: "  grocery  " });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("returns all transactions when the search is empty", () => {
      const result = applyFilters({ search: "" });

      expect(result).toHaveLength(transactions.length);
    });

    it("returns an empty array when nothing matches", () => {
      const result = applyFilters({ search: "nonexistent transaction" });

      expect(result).toEqual([]);
    });

    it("matches uncategorized transactions using the fallback category", () => {
      const result = applyFilters({ search: "uncategorized" });

      expect(result.map((transaction) => transaction.id)).toContain("6");
      expect(result.map((transaction) => transaction.id)).toContain("7");
    });
  });

  describe("transaction type filtering", () => {
    it("returns only income transactions", () => {
      const result = applyFilters({ type: "income" });

      expect(result.map((transaction) => transaction.id)).toEqual(
        expect.arrayContaining(["2", "5"]),
      );
      expect(result).toHaveLength(2);
      expect(result.every((transaction) => transaction.amountCentavos > 0))
        .toBe(true);
    });

    it("returns only expense transactions", () => {
      const result = applyFilters({ type: "expense" });

      expect(result).toHaveLength(4);
      expect(result.every((transaction) => transaction.amountCentavos < 0))
        .toBe(true);
    });

    it("excludes zero-amount transactions from income and expenses", () => {
      const income = applyFilters({ type: "income" });
      const expenses = applyFilters({ type: "expense" });

      expect(income.some((transaction) => transaction.id === "7")).toBe(false);
      expect(expenses.some((transaction) => transaction.id === "7")).toBe(false);
    });

    it("returns all transaction types when type is all", () => {
      const result = applyFilters({ type: "all" });

      expect(result).toHaveLength(transactions.length);
    });
  });

  describe("category filtering", () => {
    it("returns transactions from the selected category", () => {
      const result = applyFilters({ category: "grocery" });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("matches categories without case sensitivity", () => {
      const result = applyFilters({ category: "SALARY" });

      expect(result).toHaveLength(2);
      expect(result.every((transaction) => transaction.categoryName === "salary"))
        .toBe(true);
    });

    it("filters uncategorized transactions", () => {
      const result = applyFilters({ category: "uncategorized" });

      expect(result.map((transaction) => transaction.id)).toEqual(
        expect.arrayContaining(["6", "7"]),
      );
      expect(result).toHaveLength(2);
    });

    it("returns all categories when category is all", () => {
      const result = applyFilters({ category: "all" });

      expect(result).toHaveLength(transactions.length);
    });

    it("returns an empty array for a category with no matches", () => {
      const result = applyFilters({ category: "healthcare" });

      expect(result).toEqual([]);
    });
  });

  describe("date range filtering", () => {
    it("returns all dates when date range is all", () => {
      const result = applyFilters({ dateRange: "all" });

      expect(result).toHaveLength(transactions.length);
    });

    it("returns transactions within the last seven calendar days", () => {
      const result = applyFilters({ dateRange: "7days" });

      // Reference date: October 6, 2026.
      // Expected inclusive range: September 30 through October 6.
      expect(result.map((transaction) => transaction.id)).toEqual(
        expect.arrayContaining(["1", "2", "6", "7"]),
      );
      expect(result).toHaveLength(4);
    });

    it("returns transactions within the last thirty calendar days", () => {
      const result = applyFilters({ dateRange: "30days" });

      // Expected inclusive range: September 7 through October 6.
      expect(result.map((transaction) => transaction.id)).toEqual(
        expect.arrayContaining(["1", "2", "3", "4", "6", "7"]),
      );
      expect(result).toHaveLength(6);
    });

    it("returns transactions from the current month", () => {
      const result = applyFilters({ dateRange: "thisMonth" });

      expect(result.map((transaction) => transaction.id)).toEqual(
        expect.arrayContaining(["1", "2", "6", "7"]),
      );
      expect(result).toHaveLength(4);
    });

    it("excludes transactions before the selected date range", () => {
      const result = applyFilters({ dateRange: "7days" });

      expect(result.some((transaction) => transaction.id === "3")).toBe(false);
      expect(result.some((transaction) => transaction.id === "4")).toBe(false);
      expect(result.some((transaction) => transaction.id === "5")).toBe(false);
    });
  });

  describe("sorting", () => {
    it("sorts transactions newest first by default", () => {
      const result = applyFilters({ sortOrder: "newest" });

      expect(
        result.map((transaction) => transaction.id),
      ).toEqual(["1", "2", "7", "6", "3", "4", "5"]);
    });

    it("sorts transactions oldest first", () => {
      const result = applyFilters({ sortOrder: "oldest" });

      expect(
        result.map((transaction) => transaction.id),
      ).toEqual(["5", "4", "3", "6", "7", "2", "1"]);
    });

    it("does not mutate the original transaction array", () => {
      const originalOrder = transactions.map((transaction) => transaction.id);

      applyFilters({ sortOrder: "oldest" });

      expect(transactions.map((transaction) => transaction.id)).toEqual(
        originalOrder,
      );
    });
  });

  describe("combined filters", () => {
    it("combines search and transaction type filters", () => {
      const result = applyFilters({
        search: "salary",
        type: "income",
      });

      expect(result).toHaveLength(2);
      expect(result.every((transaction) => transaction.amountCentavos > 0))
        .toBe(true);
    });

    it("combines category and date range filters", () => {
      const result = applyFilters({
        category: "salary",
        dateRange: "thisMonth",
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("returns an empty array when combined filters have no matches", () => {
      const result = applyFilters({
        type: "income",
        category: "grocery",
      });

      expect(result).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("handles an empty transaction list", () => {
      const result = filterTransactions(
        [],
        INITIAL_FILTERS,
        // new Date("2026-10-06T12:00:00.000Z"),
      );

      expect(result).toEqual([]);
    });

    it("handles an empty description", () => {
      const emptyDescription = [
        createTransaction({ id: "empty", description: "", categoryName: "food" }),
      ];

      const result = filterTransactions(
        emptyDescription,
        { ...INITIAL_FILTERS, search: "grocery" },
        // new Date("2026-10-06T12:00:00.000Z"),
      );

      expect(result).toEqual([]);
    });

    it("handles a null category name", () => {
      const uncategorized = [
        createTransaction({ id: "null-category", categoryName: null }),
      ];

      const result = filterTransactions(
        uncategorized,
        { ...INITIAL_FILTERS, category: "uncategorized" },
        // new Date("2026-10-06T12:00:00.000Z"),
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("null-category");
    });
  });
});
