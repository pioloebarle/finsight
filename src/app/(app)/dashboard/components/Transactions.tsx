"use client";

import Link from "next/link";
import { ChevronRight, Wallet } from 'lucide-react';
import { getCategoryConfig } from '../data/categories';
import { formatDate, formatSignedCurrency } from '@/lib/format';
import TransactionDetailDrawer from "@/app/(app)/components/TransactionDetailDrawer";
import type { TransactionDetail } from "@/app/(app)/components/TransactionDetailDrawer";
import { useState } from 'react';

type Transaction = {
    id: string;
    description: string;
    categoryName: string | null;
    amountCentavos: number;
    transactionDate: Date;
}
export default function Transactions({ transactions }: { transactions: Transaction[] }) {
    const transactionColumns =
        "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_20px] items-center gap-3 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1fr)_20px] sm:gap-4";

    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
    
    return (
        <div className="mt-6 w-full rounded-finsight-lg border border-finsight-gray-500 bg-white p-6">
            <div className="mb-4 flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Link
                    href="/transactions" 
                    className="flex items-center gap-2 text-finsight-primary hover:underline"
                >
                    <span className="text-base font-medium">View All</span>
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>

            {/* Header row: 5 children to match the 5 columns */}
            <div className={`${transactionColumns} px-1 pb-3 text-sm font-medium text-finsight-muted`}>
                <span>Description</span>
                <span className="hidden sm:block">Category</span>
                <span className="hidden sm:block">Date</span>
                <span className="text-right">Amount</span>
                <span /> {/* empty cell above the chevrons */}
            </div>

            {transactions.slice(0, 5).map((transaction) => {
                const categoryName = 
                    transaction.categoryName || "uncategorized";
                    
                const isIncome = transaction.amountCentavos > 0;
                const isExpense = transaction.amountCentavos < 0;

                const config = isIncome && categoryName === null
                    ? { name: "Salary", icon: Wallet }
                    : getCategoryConfig(categoryName);

                const Icon = config.icon;



                return (
                <button
                    key={transaction.id}
                    type="button"
                    onClick={() => setSelectedTransaction(transaction)}
                    className={`${transactionColumns} group border-t border-finsight-border-light px-1 py-3.5 text-left transition-colors hover:bg-finsight-surface-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-finsight-primary`}

                >
                    {/* 1. Description: icon AND text in the same cell */}
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft">
                            <Icon className="h-4 w-4 text-finsight-primary" />
                        </div>

                        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-finsight-text">
                            {transaction.description}
                        </span>
                    </div>


                    {/* 2. Category */}
                    <span className="hidden text-sm text-finsight-text-secondary sm:block">
                        {config.name}
                    </span>

                    {/* 3. Date */}
                    <span className="hidden whitespace-nowrap text-sm text-finsight-muted sm:block">
                        {formatDate(transaction.transactionDate)}
                    </span>

                    {/* 4. Amount */}
                    <span className={`text-right text-sm font-semibold tabular-nums
                        ${isIncome 
                            ? "text-finsight-income"
                            : isExpense
                            ? "text-finsight-expense"
                            : "text-finsight-text"
                        }
                    `}>
                    <span className="sr-only">{isIncome ? "Income " : isExpense ? "Expense " : ""}</span>
                    {formatSignedCurrency(transaction.amountCentavos)}
                    </span>

                    {/* 5. Chevron */}
                    <ChevronRight className="h-4 w-4 text-finsight-muted transition-colors group-hover:text-finsight-primary" />
                </button>
                );
            })}

            <TransactionDetailDrawer
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />

        </div>
    )
}