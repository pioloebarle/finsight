import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionFilter from "./components/TransactionFilter";
import TransactionList from "./components/TransactionList";
import { getCategories } from '@/lib/queries/categories';
import { formatMonthYear } from '@/lib/format';
import { parseMonthOrCurrent, monthToDate } from '@/lib/validation/month';
import { getTransactions } from "@/lib/queries/getTransactions";

type PageProps = { searchParams: Promise<{ month?: string | string[] }> };

export default async function TransactionPage({ searchParams }: PageProps) {
    
    const { month: rawMonth } = await searchParams;
    const parsed = parseMonthOrCurrent(typeof rawMonth === "string" ? rawMonth : undefined);
    const monthDate = monthToDate(parsed);

    const userId = process.env.DEV_USER_ID;
    if(!userId) throw new Error("DEV_USER_ID is not set in environment variables.");
    
    const [recent, categories] = await Promise.all([
        getTransactions(userId, monthDate),
        getCategories(userId)
    ]);

    return (
        <main className="min-h-screen bg-finsight-background">
            <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 lg:px-6">
                <Header categories={categories} />

                <hr className="mb-10 mt-3 border-t border-gray-300" />

                <SummaryCards />
                
                <TransactionFilter />

                <TransactionList monthLabel={formatMonthYear(monthDate)} transactions={recent} />
               
            </div>
        </main>
    );
}