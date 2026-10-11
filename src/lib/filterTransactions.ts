
export type Transaction = {
    id: string;
    description: string;
    categoryName: string | null;
    amountCentavos: number;
    transactionDate: Date;
};

export type TransactionFilters = {
    search: string;
    type: string;
    category: string;
    dateRange: string;
    sortOrder: string;
};

export const INITIAL_FILTERS: TransactionFilters = {
    search: "",
    type: "all",
    category: "all",
    dateRange: "all",
    sortOrder: "newest",
};

export function filterTransactions(transactions: Transaction[], filters: TransactionFilters, referenceDate: Date = new Date()): Transaction[] {
    const now = new Date();

    const today = new Date(Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()));

    const filtered = transactions.filter((transaction) => {
        const description = transaction.description.toLowerCase();
        const categoryName = (transaction.categoryName ?? "uncategorized").toLowerCase();

        // Search by description or category
        const searchTerm = filters.search.trim().toLowerCase();

        const matchesSearch = 
            description.includes(searchTerm) ||
            categoryName.includes(searchTerm);
        
        // Filter by transaction type using the amount's sign.
        const matchesType = 
            filters.type === "all" ||
            (filters.type === "income" && transaction.amountCentavos > 0) ||
            (filters.type === "expense" && transaction.amountCentavos < 0)
        
        // Filters by category
        const matchesCategory = 
            filters.category === "all" ||
            categoryName === filters.category.toLowerCase();

        // Normalize the transaction date to a UTC calendar day
        const transactionDate = new Date(
            Date.UTC(
                transaction.transactionDate.getUTCFullYear(),
                transaction.transactionDate.getUTCMonth(),
                transaction.transactionDate.getUTCDate(),
            )
        );

        let matchesDate = true;

        if (filters.dateRange === "7days"){
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setUTCDate(today.getUTCDate() - 6);

            matchesDate = transactionDate >= sevenDaysAgo && transactionDate <= today;
        }
        else if (filters.dateRange === "30days"){
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setUTCDate(today.getUTCDate() - 29);

            matchesDate = transactionDate >= thirtyDaysAgo && transactionDate <= today;
        }
        else if (filters.dateRange === "thisMonth"){
            matchesDate = 
                transactionDate.getUTCMonth() === today.getUTCMonth() && 
                transactionDate.getUTCFullYear() === today.getUTCFullYear();
        }

        return (
            matchesSearch &&
            matchesType &&
            matchesCategory &&
            matchesDate
        );
    
    });

    return filtered.sort((a, b) => {
        const difference = 
            a.transactionDate.getTime() - b.transactionDate.getTime();

            return filters.sortOrder === "oldest" ? difference : -difference;
    })
}

