import { describe, it, expect } from "vitest";
import { formatDate, formatCurrency } from "../../format";

describe("formatHelpers", () => {
    it("formats a UTC date as a short date", () => {
        expect(formatDate(new Date("2026-10-05"))).toBe("Oct 05, 2026");
    });
    it("formats centavos as pesos, always positive", () => {
        expect(formatCurrency(-17000)).toBe("₱170.00");
        expect(formatCurrency(-18900)).toBe("₱189.00");
        expect(formatCurrency(123456)).toBe("₱1,234.56");
    })
})