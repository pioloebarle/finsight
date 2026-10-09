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
            <div className="flex items-center justify-between">
                <Image 
                src="/logo.png"
                alt="FinSight Logo"
                width={2079}
                height={756}
                className="h-[50px] w-auto"
                priority
                />

                <button
                    onClick = {() => setIsOpen(true)} 
                    className="flex items-center gap-2 bg-finsight-primary text-finsight-background p-3 rounded-finsight-lg font-medium hover:bg-finsight-primary-hover"
                >
                    <Plus className="w-4 h-4" /> Add Transaction
                </button>

                {isOpen && (
                    <TransactionModal 
                        isOpen = {isOpen}
                        onClose= {() => setIsOpen(false)}
                        categories = {categories}
                    />
                )}
            </div>
        </div>
    )
}