"use client";

import { useState, useEffect } from "react";
import {
    CalendarDays,
    ChevronDown,
    Tag,
    Check,
    CircleHelp,
    X,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatSignedCurrency } from "@/lib/format";
import type { CategoryOption } from "@/types/dashboard";
import { getCategoryConfig } from "../data/categories";
import { createTransaction } from "@/app/transactions/actions";

type TransactionType = "income" | "expense";

export default function TransactionModal({isOpen, onClose, categories}: {isOpen: boolean, onClose: () => void, categories: CategoryOption[]}) {
    const [type, setType] = useState<TransactionType>("expense");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});


    useEffect(() => {
    if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(isSubmitting) return; 

        const formData = new FormData(event.currentTarget);

        setIsSubmitting(true);
        setSubmitError(null);
        setFieldErrors({});

        try {
            const result = await createTransaction(formData);
            
            if (!result.success) {
                setFieldErrors(result.errors ?? {});
                setSubmitError(result.message ?? "An error occurred. Please try again.");
                return;
            }

            setFieldErrors({});
            
            onClose();
            toast.success("Transaction added", {
                description: `${result.description} · ${formatSignedCurrency(result.amountCentavos ?? 0)}`,
            });

        } catch (error) {
            console.error("Failed to submit transaction:", error);
            setSubmitError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    // below the early return, a default date of "today" in Manila (en-CA formats as YYYY-MM-DD):
    const todayInManila = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

    return (
        <div className="fixed inset-0 z-50 flex animate-modal-backdrop items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-modal-title"
                className="relative w-full max-w-4xl animate-modal-in rounded-finsight-lg border border-finsight-border bg-finsight-background p-8 shadow-xl"
            >

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-finsight-close-button-hover text-finsight-muted transition-colors hover:bg-finsight-close-button-active hover:text-finsight-text"
                    aria-label="Close transaction modal"
                >
                    <X className="h-5 w-5 " />
                </button>

                {/* Header */}
                <div className="mb-7">
                    <span className="mb-4 inline-block select-none rounded-full bg-finsight-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-finsight-primary shadow-[0_2px_4px_rgba(12,166,120,0.15)]">
                        New Transaction
                    </span>

                    <h2 
                        id="transaction-modal-title"
                        className="text-3xl font-semibold text-finsight-text"
                    >
                        Add Transaction
                    </h2>

                    <p className="mt-1 text-lg text-finsight-muted">
                        Track your income and expenses to stay on top of your finances.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="type" value={type} />
                    <input type="hidden" name="categoryId" value={selectedCategory ?? ""} />    
                    {/* Transaction Type */}
                    <div className="mb-7 w-full rounded-finsight-xl border border-finsight-gray-900 bg-finsight-surface p-4">
                        <div
                            role="radiogroup"
                            aria-label="Transaction type"
                            className="relative grid grid-cols-2 rounded-xl bg-finsight-surface-soft p-1"
                        >
                            {/* Sliding Indicator */}
                            <div
                                className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-transform duration-200 ease-out ${
                                    type === "income"
                                        ? "translate-x-full"
                                        : "translate-x-0"
                                }`}
                            />

                            <button
                                type="button"
                                role="radio"
                                aria-checked={type === "expense"}
                                onClick={() => setType("expense")}
                                className={`relative z-10 h-10 rounded-lg text-base font-medium transition-colors duration-200 ${
                                    type === "expense"
                                        ? "text-finsight-expense"
                                        : "text-finsight-muted hover:text-finsight-text-secondary"
                                }`}
                            >
                                Expense
                            </button>

                            <button
                                type="button"
                                role="radio"
                                aria-checked={type === "income"}
                                onClick={() => setType("income")}
                                className={`relative z-10 h-10 rounded-lg text-base font-medium transition-colors duration-200 ${
                                    type === "income"
                                        ? "text-finsight-income"
                                        : "text-finsight-muted hover:text-finsight-text-secondary"
                                }`}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-base font-semibold text-finsight-text"
                        >
                            Description
                        </label>

                        <input
                            id="description"
                            name="description"
                            type="text"
                            required
                            placeholder="e.g. Groceries, Salary, etc."
                            maxLength={50}
                            className="h-12 w-full rounded-xl border border-finsight-border bg-white px-4 text-base text-finsight-text outline-none transition-all placeholder:text-finsight-muted focus:border-finsight-primary focus:ring-3 focus:ring-finsight-primary-soft"
                        />

                        {fieldErrors.description?.[0] && (
                            <p className="text-sm text-red-600">
                                {fieldErrors.description[0]}
                            </p>
                        )}

                        {/* <div className="mt-1.5 flex justify-end">
                            <span className="text-base text-finsight-muted">
                                0/100
                            </span>
                        </div> */}
                    </div>

                    {/* Amount + Date */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {/* Amount */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="mb-2 block text-base font-semibold text-finsight-text"
                            >
                                Amount
                            </label>

                            <div className="flex h-12 overflow-hidden rounded-xl border border-finsight-border bg-white transition-all focus-within:border-finsight-primary focus-within:ring-3 focus-within:ring-finsight-primary-soft">
                                <div className="flex w-14 shrink-0 items-center justify-center border-r border-finsight-border-light bg-finsight-surface-soft text-base font-medium text-finsight-text-secondary">
                                    ₱
                                </div>

                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="min-w-0 flex-1 bg-transparent px-4 text-base text-finsight-text outline-none placeholder:text-finsight-muted"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label
                                htmlFor="date"
                                className="mb-2 block text-base font-semibold text-finsight-text"
                            >
                                Date
                            </label>

                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-finsight-muted" />

                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    defaultValue={todayInManila}
                                    className="h-12 w-full rounded-xl border border-finsight-border bg-white pl-11 pr-4 text-base text-finsight-text outline-none transition-all focus:border-finsight-primary focus:ring-3 focus:ring-finsight-primary-soft"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <span
                            id="category-label"
                            className="mb-2 block text-base font-semibold text-finsight-text"
                        >
                            Category{" "}
                            <span className="font-normal text-finsight-muted">
                                (Optional)
                            </span>
                        </span>

                        <div className="relative">
                            {/* Category Selector */}
                            <button
                                type="button"
                                aria-labelledby="category-label"
                                aria-haspopup="listbox"
                                aria-expanded={isCategoryOpen}
                                onClick={() => setIsCategoryOpen((open) => !open)}
                                className={`flex h-12 w-full items-center rounded-xl border bg-white px-4 text-left text-sm outline-none transition-all ${
                                    isCategoryOpen
                                        ? "border-finsight-primary ring-3 ring-finsight-primary-soft"
                                        : "border-finsight-border hover:border-finsight-border-strong"
                                }`}
                            >
                            
                                {/* Tag icon - always visible */}
                                <Tag className="mr-3 h-4 w-4 shrink-0 text-finsight-muted" />

                                {/* Selected category / placeholder */}
                                <span
                                    className={
                                        selectedCategory
                                            ? "font-medium text-finsight-text text-base"
                                            : "text-finsight-muted text-base"
                                    }
                                >
                                    {selectedCategory
                                        ? categories.find(
                                            (category) =>
                                                category.id === selectedCategory
                                        )?.categoryName
                                        : "Select a category"}
                                </span>

                                {/* Dropdown arrow */}
                                <ChevronDown
                                    className={`ml-auto h-4 w-4 shrink-0 text-finsight-muted transition-transform duration-200 ${
                                        isCategoryOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown */}
                            {isCategoryOpen && (
                                <div
                                    role="listbox"
                                    className="finsight-scrollbar absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-finsight-border bg-white p-1.5 shadow-lg"
                                >
                                    {/* Uncategorized */}
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={selectedCategory === null}
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-colors ${
                                            selectedCategory === null
                                                ? "bg-finsight-primary-soft"
                                                : "hover:bg-finsight-surface-soft"
                                        }`}
                                    >
                                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-finsight-surface-soft">
                                            <CircleHelp className="h-4 w-4 text-finsight-muted" />
                                        </span>

                                        <span className="flex-1">
                                            <span className="block text-sm font-medium text-finsight-text">
                                                Uncategorized
                                            </span>

                                            <span className="block text-xs text-finsight-muted">
                                                No category assigned
                                            </span>
                                        </span>

                                        {selectedCategory === null && (
                                            <Check className="h-4 w-4 text-finsight-primary" />
                                        )}
                                    </button>

                                    {/* Categories */}
                                    {categories.map((category) => {
                                        const config = getCategoryConfig(category.categoryName);
                                        const Icon = config.icon;
                                        const isSelected =
                                            selectedCategory === category.id;

                                        return (
                                            <button
                                                key={category.id}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    setSelectedCategory(category.id);
                                                    setIsCategoryOpen(false);

                                                    const isSalary = 
                                                        category.categoryName.toLowerCase() === "salary";
                                                        setType(isSalary ? "income" : "expense");
                                                }}
                                                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left transition-colors ${
                                                    isSelected
                                                        ? "bg-finsight-primary-soft"
                                                        : "hover:bg-finsight-surface-soft"
                                                }`}
                                            >
                                                {/* Category icon */}
                                                <span
                                                    className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg ${config.iconClass}`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </span>

                                                <span className="flex-1 text-sm font-medium text-finsight-text">
                                                    {category.categoryName}
                                                </span>

                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-finsight-primary" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-finsight-border-light" />

                    {submitError && (
                        <p role="alert" className="text-sm text-red-600">
                            {submitError}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl border border-finsight-border bg-white px-5 text-sm font-medium text-finsight-text-secondary transition-colors hover:bg-finsight-surface-soft hover:text-finsight-text"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit" 
                            disabled={isSubmitting}
                            className="h-11 rounded-xl bg-finsight-primary px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-finsight-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                                    Saving...
                                </span>
                            ) : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}