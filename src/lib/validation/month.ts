import { z } from "zod";

export const MONTH_ERROR_MESSAGE = "Invalid month format. Expected YYYY-MM (e.g., 2026-10).";

export const monthSchema = z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, { message: MONTH_ERROR_MESSAGE });

export type ParsedMonth = { year: number; month: number };

export function parseMonth(value: string | null | undefined): ParsedMonth | null {
    const result = monthSchema.safeParse(value ?? "");
    if (!result.success) return null;

    const [year, month] = result.data.split("-").map(Number);
    return { year, month };
}

export function parseMonthOrCurrent(
    value: string | null | undefined,
    now: Date = new Date()
): ParsedMonth {
    return parseMonth(value) ?? { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

export function monthToDate({ year, month }: ParsedMonth): Date {
    return new Date(Date.UTC(year, month - 1, 1));
}