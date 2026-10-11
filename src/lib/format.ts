const dateFormatter = new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
});

const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
})

export function formatDate(date: Date): string {
    return dateFormatter.format(date);
}

export function formatCurrency(amountCentavos: number): string {
    return pesoFormatter.format(Math.abs(amountCentavos) / 100);
}

const monthYearFormatter = new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric", timeZone: "UTC" });
const monthDayFormatter = new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", timeZone: "UTC" });

// monthDate = first of the month, UTC. -> "October 2026"
export function formatMonthYear(monthDate: Date): string {
  return monthYearFormatter.format(monthDate);
}

// -> "October 1 - October 31, 2026"
export function formatMonthRange(monthDate: Date): string {
  const last = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0));
  return `${monthDayFormatter.format(monthDate)} - ${monthDayFormatter.format(last)}, ${last.getUTCFullYear()}`;
}

// Number only, no peso sign: 123456 -> "1,234.56". For your big "₱" + number design.
export function formatAmount(centavos: number): string {
  return new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(centavos) / 100);
}

// Income: "+₱5,000.00". Expense: "-₱178.00". Zero: "₱0.00".
export function formatSignedCurrency(centavos: number): string {
  const text = pesoFormatter.format(Math.abs(centavos) / 100);
  if (centavos > 0) return `+${text}`;
  if (centavos < 0) return `-${text}`;
  return text;
}

export function formatMonthDay(monthDate: Date): string {
  return monthDayFormatter.format(monthDate);
}