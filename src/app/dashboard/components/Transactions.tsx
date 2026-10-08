import { ChevronRight, Wallet } from 'lucide-react';
import { getCategoryConfig } from '../data/categories';
import { formatDate, formatSignedCurrency } from '@/lib/format';

type Transaction = {
    id: string;
    description: string;
    categoryName: string | null;
    amountCentavos: number;
    transactionDate: Date;
}
export default function Transactions({ transactions }: { transactions: Transaction[] }) {
    const transactionColumns =
        "grid grid-cols-[1fr_auto_24px] items-center gap-4 sm:grid-cols-[2.2fr_1.3fr_1.3fr_1fr_24px]";
    
    return (
        <div className="mt-6 w-full rounded-finsight-lg border border-finsight-gray-500 bg-white p-6">
        <div className="mb-4 flex w-full items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-finsight-primary hover:underline">
            <span className="text-base font-medium">View All</span>
            <ChevronRight className="h-5 w-5" />
            </button>
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
            <div
                key={transaction.id}
                className={`${transactionColumns} group border-t border-finsight-border-light px-1 py-3.5 transition-colors hover:bg-finsight-surface-soft`}
            >
                {/* 1. Description: icon AND text in the same cell */}
                <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft">
                    <Icon className="h-4 w-4 text-finsight-primary" />
                </div>
                <span className="text-sm font-medium text-finsight-text">
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
            </div>
            );
        })}
        </div>
    )
}