"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

export type TransactionFilters = {
    search: string;
    type: string;
    category: string;
    dateRange: string;
    sortOrder: string;
};

type TransactionFilterProps = {
    filters: TransactionFilters;
    onFiltersChange: (filters: TransactionFilters) => void;
};

const categories = [
    { label: "All Categories", value: "all" },
    { label: "Bills", value: "bills" },
    { label: "Internet", value: "internet" },
    { label: "Grocery", value: "grocery" },
    { label: "Food", value: "food" },
    { label: "Subscriptions", value: "subscriptions" },
    { label: "Transportation", value: "transportation" },
    { label: "Salary", value: "salary" },
    { label: "Uncategorized", value: "uncategorized" },
];

export default function TransactionFilter({ filters, onFiltersChange }: TransactionFilterProps) {

    const { search, type, category, dateRange, sortOrder } = filters;

    function updateFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
        onFiltersChange({ ...filters, [key]: value });
    }
    
    return (
        <div>
             {/* Search and Filters */}
            <section className="mt-8 space-y-4" aria-label="Search and filter transactions">
                {/* Search Bar */}
                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-finsight-muted"
                    />

                    <input
                        type="search"
                        placeholder="Search category, description..."
                        value={search}
                        onChange={(event) => updateFilter("search", event.target.value)}
                        aria-label="Search transactions"
                        className="w-full rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface py-3 pl-12 pr-4 text-sm text-finsight-text outline-none transition placeholder:text-finsight-muted focus:border-finsight-primary focus:ring-2 focus:ring-finsight-primary/10"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        
                    {/* Transaction Type */}
                    <div
                        className="flex w-fit items-center gap-1 rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface p-1"
                        role="group"
                        aria-label="Filter by transaction type"
                    >
                        {[
                            { label: "All", value: "all" },
                            { label: "Income", value: "income" },
                            { label: "Expenses", value: "expense" },
                        ].map((item) => {
                            const isActive = type === item.value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => updateFilter("type", item.value)}
                                    aria-pressed={isActive}
                                    className={`relative isolate rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? "text-white"
                                            : "text-finsight-secondary hover:bg-finsight-background hover:text-finsight-text"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="transaction-type-indicator"
                                            className="absolute inset-0 -z-10 rounded-md bg-finsight-primary"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30,
                                            }}
                                        />
                                    )}

                                    <span className="relative">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Dropdown Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-finsight-secondary">
                            <SlidersHorizontal
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                            <span>Filters</span>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={category}
                            onChange={(event) =>
                                updateFilter("category", event.target.value)
                            }
                            aria-label="Filter by category"
                            className="min-w-36 rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface px-3 py-2.5 text-sm text-finsight-text outline-none focus:border-finsight-primary"
                        >
                            {categories.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        {/* Date Filter */}
                        <select
                            value={dateRange}
                            onChange={(event) =>
                                updateFilter("dateRange", event.target.value)
                            }
                            aria-label="Filter by date"
                            className="rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface px-3 py-2.5 text-sm text-finsight-text outline-none focus:border-finsight-primary"
                        >
                            <option value="all">All time</option>
                            <option value="7days">Last 7 days</option>
                            <option value="30days">Last 30 days</option>
                            <option value="thisMonth">This month</option>
                        </select>

                        {/* Sort Order */}
                        <select
                            value={sortOrder}
                            onChange={(event) =>
                                updateFilter("sortOrder", event.target.value)
                            }
                            aria-label="Sort transactions"
                            className="rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface px-3 py-2.5 text-sm text-finsight-text outline-none focus:border-finsight-primary"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    )
}