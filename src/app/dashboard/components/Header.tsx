"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import TransactionModal from "./TransactionModal";
import { CategoryOptions } from "@/lib/queries/categories";

export default function Header({ categories }: { categories: CategoryOptions[] }){
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            {/* Header */}
            <header className="flex min-h-14 items-center justify-between gap-4">
                    
                <h1 className="text-2xl font-semibold tracking-tight text-finsight-text sm:text-3xl">
                    Dashboard
                </h1>


                <button
                    onClick = {() => setIsOpen(true)} 
                    className="flex items-center gap-2 bg-finsight-primary text-finsight-background p-3 rounded-finsight-lg font-medium hover:bg-finsight-primary-hover"
                >
                    <Plus className="w-4 h-4" /> Add New Transaction
                </button>

                {isOpen && (
                    <TransactionModal 
                        isOpen = {isOpen}
                        onClose= {() => setIsOpen(false)}
                        categories = {categories}
                    />
                )}
            </header>
        </div>
    )
}