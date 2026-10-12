import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionBrowser from "./components/TransactionBrowser";
import MonthlyButton from "./components/MonthlyButton";
import { getCategories } from '@/lib/queries/categories';
import { formatMonthYear } from '@/lib/format';
import { getTransactions, type TransactionDateRange } from "@/lib/queries/getTransactions";
import { parseMonthOrCurrent, monthToDate, shiftMonth, formatMonthParam } from '@/lib/validation/month';

type PageProps = { searchParams: Promise<{ month?: string | string[]; range?: string | string[] }> };

const validDateRanges: TransactionDateRange[] = [
    "thisMonth",
    "7days",
    "30days",
    "thisYear",
    "allTime",
];

function parseDateRange(value: string | string[] | undefined): TransactionDateRange {
    if (typeof value === "string" && validDateRanges.includes(value as TransactionDateRange)) {
        return value as TransactionDateRange;
    }

    return "thisMonth";
}

export default async function TransactionPage({ searchParams }: PageProps) {
    
    const { month: rawMonth, range: rawRange } = await searchParams;
    const parsed = parseMonthOrCurrent(typeof rawMonth === "string" ? rawMonth : undefined);
    const monthDate = monthToDate(parsed);
    const dateRange = parseDateRange(rawRange);

    const userId = process.env.DEV_USER_ID;
    if(!userId) throw new Error("DEV_USER_ID is not set in environment variables.");
    
    const [recent, categories] = await Promise.all([
        getTransactions(userId, monthDate, dateRange),
        getCategories(userId)
    ]);

    return (
        <main className="min-h-screen bg-finsight-background">
            <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 lg:px-6">
                <Header categories={categories} />

                <hr className="mb-10 mt-3 border-t border-gray-300" />

                {dateRange === "thisMonth" && (
                    <MonthlyButton
                        monthLabel={formatMonthYear(monthDate)}
                        prevHref={`?month=${formatMonthParam(shiftMonth(parsed, -1))}`}
                        nextHref={`?month=${formatMonthParam(shiftMonth(parsed, 1))}`}
                    />
                )}

                <SummaryCards transactions={recent}/>
                
                <TransactionBrowser
                    monthLabel={formatMonthYear(monthDate)}
                    transactions={recent}
                    initialDateRange={dateRange}
                    selectedMonth={monthDate}
                />
               
            </div>
        </main>
    );
}