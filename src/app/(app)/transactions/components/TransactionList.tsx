
"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getCategoryConfig } from "@/app/(app)/dashboard/data/categories"
import { formatMonthDay, formatSignedCurrency } from "@/lib/format";

type Transaction = {
    id: string;
    description: string;
    categoryName: string | null;
    amountCentavos: number;
    transactionDate: Date;
}

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_COUNT = 5;

function isIncomeTransaction(amountCentavos: number): boolean {
    return amountCentavos > 0;
}

export default function TransactionList({ monthLabel, transactions }: { monthLabel: string, transactions: Transaction[] }) {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const monthTransactions = useMemo(() => {
        return transactions
            .filter((transaction) => {
                const transactionMonth = transaction.transactionDate.getMonth();
                const transactionYear = transaction.transactionDate.getFullYear(); 

                const selectedDate = new Date(`${monthLabel} 1`);
                const selectedMonth = selectedDate.getMonth();
                const selectedYear = selectedDate.getFullYear();

                return (
                    transactionMonth === selectedMonth &&
                    transactionYear === selectedYear
                );
            })
    }, [monthLabel, transactions]);

    const visibleTransactions = monthTransactions.slice(0, visibleCount);
    const hasMore = visibleCount < monthTransactions.length;

    return (
        <section className="mt-8">
            {/* List Header */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-finsight-text">
                    {monthLabel}
                </h2>

                <span className="text-xs text-finsight-muted sm:text-sm">
                    {monthTransactions.length} transactions
                </span>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-finsight-gray-500">
                {visibleTransactions.map((transaction, index) => {
                    const config = getCategoryConfig(
                        transaction.categoryName,
                    );

                    const Icon = config.icon;
                    const isIncome = isIncomeTransaction(transaction.amountCentavos);

                    return (
                        <div
                            key={`${transaction.description}-${transaction.transactionDate.toISOString()}-${index}`}
                            className="p-4 group flex items-center gap-3 py-4 transition-colors hover:bg-finsight-surface/70 sm:gap-4"
                        >
                            {/* Category Icon */}
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft"
                            >
                                <Icon className="h-4 w-4 text-finsight-primary" />
                            </div>

                            {/* Transaction Details */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-finsight-text sm:text-base">
                                    {transaction.description}
                                </p>

                                <p className="mt-1 text-xs text-finsight-muted sm:text-sm">
                                    {config.name} · {formatMonthDay(transaction.transactionDate)}
                                </p>
                            </div>

                            {/* Amount and Direction */}
                            <div className="flex shrink-0 items-center gap-2">
                                <p
                                    className={`text-right text-sm font-semibold tabular-nums sm:text-base ${
                                        isIncome
                                            ? "text-finsight-income"
                                            : "text-finsight-expense"
                                    }`}
                                >
                                    {formatSignedCurrency(transaction.amountCentavos)}
                                </p>

                                <ChevronRight
                                    aria-hidden="true"
                                    className="h-4 w-4 text-finsight-muted transition-transform group-hover:translate-x-0.5"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {monthTransactions.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-sm font-medium text-finsight-text">
                            No transactions found
                        </p>
                        <p className="mt-1 text-sm text-finsight-muted">
                            Transactions for this month will appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* Load More */}
            {monthTransactions.length > 0 && (
                <div className="flex flex-col items-center gap-3 border-t border-finsight-gray-500 py-5">
                    <p className="text-xs text-finsight-muted sm:text-sm">
                        Showing {visibleTransactions.length} of{" "}
                        {monthTransactions.length} transactions
                    </p>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={() =>
                                setVisibleCount((current) =>
                                    Math.min(
                                        current + LOAD_MORE_COUNT,
                                        monthTransactions.length,
                                    ),
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface px-4 py-2.5 text-sm font-medium text-finsight-primary transition hover:border-finsight-primary hover:bg-finsight-soft focus:outline-none focus:ring-2 focus:ring-finsight-primary/20"
                        >
                            <ChevronDown className="h-4 w-4" />
                            Load more transactions
                        </button>
                    )}
                </div>
            )}
            
        </section>
    )
}