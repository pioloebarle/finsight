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