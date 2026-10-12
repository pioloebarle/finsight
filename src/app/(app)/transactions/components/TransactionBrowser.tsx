"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TransactionFilter from "./TransactionFilter";
import TransactionList from "./TransactionList";
import { filterTransactions, INITIAL_FILTERS } from "@/lib/filterTransactions";
import type { Transaction, TransactionFilters } from "@/lib/filterTransactions";
import { TransactionDateRange } from "@/lib/queries/getTransactions";


type TransactionBrowserProps = {
    monthLabel: string;
    transactions: Transaction[];
    initialDateRange?: string;
    selectedMonth?: Date;
};

export default function TransactionBrowser({ monthLabel, transactions, initialDateRange = "thisMonth" }: TransactionBrowserProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] =
        useState<TransactionFilters>(() => ({...INITIAL_FILTERS, dateRange: initialDateRange}));

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        const nextRange =
        filters.dateRange === "thisMonth"
            ? null
            : filters.dateRange;

        const currentRange = params.get("range");

        if (currentRange === nextRange) {
            return;
        }

        if (nextRange === null) {
            params.delete("range");
        } else {
            params.set("range", nextRange);
        }

        const query = params.toString();
        router.replace(
            query ? `?${query}` : window.location.pathname,
            { scroll: false }
        );

    },[filters.dateRange, router, searchParams]);

    const filteredTransactions = useMemo(
        () =>
            filterTransactions(
                transactions,
                { ...filters, dateRange: "allTime" },
                new Date()
            ),
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
                dateRange={filters.dateRange as TransactionDateRange}
                transactions={filteredTransactions}
            />
        </div>
    );
}
