export const categories = [
    { categoryName: "bills" },
    { categoryName: "internet" },
    { categoryName: "grocery" },
    { categoryName: "food" },
    { categoryName: "subscription" },
    { categoryName: "transportation" },
    { categoryName: "uncategorized" },
]

export const transactions = [
    { description: "Monthly Bills", categoryName: "bills", amountCentavos: -25000, date: new Date("2026-10-05"), },
    { description: "Internet Bill", categoryName: "internet", amountCentavos: -15000, date: new Date("2026-10-07"), },
    { description: "Grocery run", categoryName: "grocery", amountCentavos: -20000, date: new Date("2026-10-08"), },
    { description: "Lunch", categoryName: "food", amountCentavos: -10000, date: new Date("2026-10-09"), },
    { description: "Spotify Plan", categoryName: "subscriptions", amountCentavos: -5000, date: new Date("2026-10-10"), },
    { description: "Total Transpo", categoryName: "transportation", amountCentavos: -12000, date: new Date("2026-10-11"), },
    { description: "Sidequests", categoryName: "uncategorized", amountCentavos: 30000, date: new Date("2026-10-12"), },
    { description: "Jollibee Dinner", categoryName: "food", amountCentavos: -28900, date: new Date("2026-10-13"), },
    { description: "Jeepney Fare", categoryName: "transportation", amountCentavos: -4500, date: new Date("2026-10-14"), },
    { description: "Netflix", categoryName: "subscriptions", amountCentavos: -54900, date: new Date("2026-10-15"), },
    { description: "Electric Bill", categoryName: "bills", amountCentavos: -125000, date: new Date("2026-10-16"), },
    { description: "October Salary", categoryName: "salary", amountCentavos: 3207500, date: new Date("2026-10-17"), },
]

export const totalCentavos = transactions.reduce((total, category) => total + category.amountCentavos, 0);

const totalsByCategory = transactions.reduce<Record<string, number>>((totals, transaction) => {
    totals[transaction.categoryName] = (totals[transaction.categoryName] ?? 0) + transaction.amountCentavos;
    return totals; 
}, {}); 

export const categoriesWithTotals = categories
    .map((category) => ({
        ...category,
        amountCentavos: totalsByCategory[category.categoryName] ?? 0,
    }))
    .sort((a, b) => b.amountCentavos - a.amountCentavos);
