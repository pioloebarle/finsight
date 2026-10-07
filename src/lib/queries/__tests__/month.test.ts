import { describe, it, expect } from "vitest";
import { parseMonth, parseMonthOrCurrent, monthToDate } from "../../validation/month";

describe("parseMonth", () => {
  it("accepts valid months", () => {
    expect(parseMonth("2026-10")).toEqual({ year: 2026, month: 10 });
    expect(parseMonth("2026-01")).toEqual({ year: 2026, month: 1 });
    expect(parseMonth("2026-12")).toEqual({ year: 2026, month: 12 });
  });

  it("rejects invalid values", () => {
    for (const bad of ["2026-13", "2026-00", "2026-1", "banana", "", " 2026-10", "2026-10-01", null, undefined]) {
      expect(parseMonth(bad)).toBeNull();
    }
  });
});

describe("parseMonthOrCurrent", () => {
  const now = new Date(Date.UTC(2026, 9, 7)); // Oct 7, 2026

  it("uses the value when valid", () => {
    expect(parseMonthOrCurrent("2026-03", now)).toEqual({ year: 2026, month: 3 });
  });

  it("falls back to the current month when invalid or missing", () => {
    expect(parseMonthOrCurrent("banana", now)).toEqual({ year: 2026, month: 10 });
    expect(parseMonthOrCurrent(null, now)).toEqual({ year: 2026, month: 10 });
  });
});

describe("monthToDate", () => {
  it("returns the first of the month at UTC midnight", () => {
    expect(monthToDate({ year: 2026, month: 10 }).toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(monthToDate({ year: 2026, month: 12 }).toISOString()).toBe("2026-12-01T00:00:00.000Z");
  });
});