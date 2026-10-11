
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../prisma", () => ({
    prisma: {
        transaction: {
            findMany: vi.fn(),
        },
    },
}));

import { prisma } from "../../prisma";
import { getTransactions } from "../getTransactions";

const findManyMock = vi.mocked(prisma.transaction.findMany);

describe("getTransactions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const userId = "user-123";
    const selectedMonth = new Date("2026-10-01T00:00:00.000Z");

    const mockRows = [
        {
            id: "transaction-1",
            description: "Salary",
            amountCentavos: 5000000,
            transactionDate: new Date("2026-10-05T00:00:00.000Z"),
            category: { categoryName: "salary" },
        },
        {
            id: "transaction-2",
            description: "Lunch",
            amountCentavos: -15000,
            transactionDate: new Date("2026-10-04T00:00:00.000Z"),
            category: null,
        },
    ];

    beforeEach(() => {
        findManyMock.mockResolvedValue(mockRows as never);
    });

    it("defaults to the selected month", async () => {
        await getTransactions(userId, selectedMonth);

        expect(findManyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    userId,
                    transactionDate: {
                        gte: new Date("2026-10-01T00:00:00.000Z"),
                        lt: new Date("2026-11-01T00:00:00.000Z"),
                    },
                },
            }),
        );
    });

    it("queries the last 7 calendar days, including today", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-11T12:00:00.000Z"));

        try {
            await getTransactions(userId, selectedMonth, "7days");

            expect(findManyMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        userId,
                        transactionDate: {
                            gte: new Date("2026-10-05T00:00:00.000Z"),
                            lt: new Date("2026-10-12T00:00:00.000Z"),
                        },
                    },
                }),
            );
        } finally {
            vi.useRealTimers();
        }
    });

    it("queries the last 30 calendar days, including today", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-11T12:00:00.000Z"));

        try {
            await getTransactions(userId, selectedMonth, "30days");

            expect(findManyMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        userId,
                        transactionDate: {
                            gte: new Date("2026-09-12T00:00:00.000Z"),
                            lt: new Date("2026-10-12T00:00:00.000Z"),
                        },
                    },
                }),
            );
        } finally {
            vi.useRealTimers();
        }
    });

    it("queries the current calendar year", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-11T12:00:00.000Z"));

        try {
            await getTransactions(userId, selectedMonth, "thisYear");

            expect(findManyMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        userId,
                        transactionDate: {
                            gte: new Date("2026-01-01T00:00:00.000Z"),
                            lt: new Date("2027-01-01T00:00:00.000Z"),
                        },
                    },
                }),
            );
        } finally {
            vi.useRealTimers();
        }
    });

    it("does not apply a date filter for all time", async () => {
        await getTransactions(userId, selectedMonth, "allTime");

        expect(findManyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId },
            }),
        );
    });

    it("preserves the transaction sort order", async () => {
        await getTransactions(userId, selectedMonth);

        expect(findManyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                orderBy: [
                    { transactionDate: "desc" },
                    { createdAt: "desc" },
                    { id: "desc" },
                ],
            }),
        );
    });

    it("maps category names and converts missing categories to null", async () => {
        const result = await getTransactions(userId, selectedMonth);

        expect(result).toEqual([
            {
                id: "transaction-1",
                description: "Salary",
                amountCentavos: 5000000,
                transactionDate: mockRows[0].transactionDate,
                categoryName: "salary",
            },
            {
                id: "transaction-2",
                description: "Lunch",
                amountCentavos: -15000,
                transactionDate: mockRows[1].transactionDate,
                categoryName: null,
            },
        ]);
    });

    it("returns an empty array when no transactions exist", async () => {
        findManyMock.mockResolvedValue([] as never);

        const result = await getTransactions(userId, selectedMonth);

        expect(result).toEqual([]);
    });
});
