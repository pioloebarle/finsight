
"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Pencil, Trash2 } from "lucide-react";
import { getCategoryConfig } from "@/app/(app)/dashboard/data/categories";
import { formatSignedCurrency } from "@/lib/format";

export type TransactionDetail = {
    id: string;
    description: string;
    categoryName: string | null;
    amountCentavos: number;
    transactionDate: Date;
};

type TransactionDetailDrawerProps = {
    transaction: TransactionDetail | null;
    onClose: () => void;
};

export default function TransactionDetailDrawer({ transaction, onClose }: TransactionDetailDrawerProps) {
    const titleId = useId();

    const category = transaction ? getCategoryConfig(transaction.categoryName) : null;

    const isIncome = transaction ? transaction.amountCentavos > 0 : false;

    const isExpense = transaction ? transaction.amountCentavos < 0 : false;

    const formattedDate = transaction
        ? new Date(transaction.transactionDate).toLocaleDateString("en-PH", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
          })
        : "";

    const CategoryIcon = category?.icon;

    return (
        <AnimatePresence>
            {transaction && category && CategoryIcon && (
                <motion.div
                    key="transaction-detail-backdrop"
                    className="fixed inset-0 z-50 bg-slate-950/35
                        backdrop-blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.22,
                        ease: "easeOut",
                    }}
                    onClick={onClose}
                >
                    <motion.aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        onClick={(event) => event.stopPropagation()}
                        initial={{
                            x: "100%",
                            y: 0,
                        }}
                        animate={{
                            x: 0,
                            y: 0,
                        }}
                        exit={{
                            x: "100%",
                            y: 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 32,
                        }}
                        className="absolute inset-x-0 bottom-0 flex
                            max-h-[88dvh] flex-col overflow-hidden
                            rounded-t-2xl border border-finsight-gray-500
                            bg-finsight-surface text-finsight-text shadow-2xl
                            sm:inset-y-0 sm:left-auto sm:right-0
                            sm:max-h-none sm:w-full sm:max-w-115
                            sm:rounded-none sm:border-y-0
                            sm:border-r-0 sm:border-l"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between
                            border-b border-finsight-gray-500
                            px-5 py-4 sm:px-6">
                            <h2
                                id={titleId}
                                className="text-base font-semibold"
                            >
                                Transaction details
                            </h2>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close transaction details"
                                className="rounded-lg p-2 text-finsight-muted
                                    transition-colors
                                    hover:bg-finsight-background
                                    hover:text-finsight-text
                                    focus-visible:outline-2
                                    focus-visible:outline-finsight-primary"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                            {/* Transaction summary */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0
                                    items-center justify-center rounded-xl
                                    bg-finsight-primary-soft">
                                    <CategoryIcon
                                        className="h-5 w-5
                                            text-finsight-primary"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-base
                                        font-semibold text-finsight-text">
                                        {transaction.description}
                                    </h3>

                                    <p className="mt-1 text-sm
                                        text-finsight-muted">
                                        {category.name}
                                    </p>

                                    <p
                                        className={`mt-3 text-2xl font-semibold
                                            tracking-tight tabular-nums ${
                                            isIncome
                                                ? "text-finsight-income"
                                                : isExpense
                                                  ? "text-finsight-expense"
                                                  : "text-finsight-text"
                                        }`}
                                    >
                                        {formatSignedCurrency(
                                            transaction.amountCentavos
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs
                                        text-finsight-muted">
                                        {isIncome
                                            ? "Income"
                                            : isExpense
                                              ? "Expense"
                                              : "No cash flow"}
                                    </p>
                                </div>
                            </div>

                            {/* Transaction details */}
                            <div className="mt-7 border-y
                                border-finsight-gray-500 py-2">
                                <DetailRow
                                    label="Transaction date"
                                    value={formattedDate}
                                />

                                <DetailRow
                                    label="Category"
                                    value={category.name}
                                />

                                <DetailRow
                                    label="Description"
                                    value={transaction.description}
                                />
                            </div>

                            {/* Actions — functionality comes later */}
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    disabled
                                    title="Editing will be implemented later"
                                    className="flex min-h-14 flex-col
                                        items-center justify-center gap-1.5
                                        rounded-xl border
                                        border-finsight-gray-500
                                        text-sm font-medium
                                        text-finsight-muted opacity-70"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    disabled
                                    title="Deletion will be implemented later"
                                    className="flex min-h-14 flex-col
                                        items-center justify-center gap-1.5
                                        rounded-xl border
                                        border-finsight-gray-500
                                        text-sm font-medium
                                        text-finsight-expense opacity-70"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DetailRow({ label, value }: { label: string; value: string; }) {
    return (
        <div className="flex items-start justify-between gap-5 py-3">
            <span className="shrink-0 text-sm text-finsight-muted">
                {label}
            </span>

            <span className="min-w-0 break-words text-right
                text-sm font-medium text-finsight-text">
                {value}
            </span>
        </div>
    );
}
