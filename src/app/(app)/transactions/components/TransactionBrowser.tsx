
"use client";

import { useState, useMemo } from "react";
import TransactionFilter from "./TransactionFilter";
import TransactionList from "./TransactionList";

import { filterTransactions, INITIAL_FILTERS, } from "@/lib/filterTransactions";
import type { Transaction, TransactionFilters, } from "@/lib/filterTransactions";

type TransactionBrowserProps = {
    monthLabel: string;
    transactions: Transaction[];
};

export default function TransactionBrowser({ monthLabel, transactions, }: TransactionBrowserProps) {


    const [filters, setFilters] =
        useState<TransactionFilters>(INITIAL_FILTERS);

    const filteredTransactions = useMemo(
        () => filterTransactions(transactions, filters),
        [transactions, filters]
    );

    return (
        <div>
            <TransactionFilter
                filters={filters}
                onFiltersChange={setFilters}
            />

            <TransactionList
                monthLabel={monthLabel}
                transactions={filteredTransactions}
            />
        </div>
    );
}
