import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import SpendingBreakdown from './components/SpendingBreakdown';
import SummaryCard from './components/SummaryCard';
import Transactions from './components/Transactions';
import { getSpendingByCategory } from '@/lib/queries/spending';
import { getRecentTransactions } from '@/lib/queries/transactions';
import { parseMonthOrCurrent, monthToDate, shiftMonth, formatMonthParam } from '@/lib/validation/month';
import { formatMonthYear, formatMonthRange } from '@/lib/format';
import { getCategories } from '@/lib/queries/categories';
import { SpendingRowView } from '@/types/dashboard';

type PageProps = { searchParams: Promise<{ month?: string | string[] }> };

export default async function DashboardPage({ searchParams }: PageProps) {

  const { month: rawMonth } = await searchParams;
  const parsed = parseMonthOrCurrent(typeof rawMonth === "string" ? rawMonth : undefined);
  const monthDate = monthToDate(parsed);

  const userId = process.env.DEV_USER_ID;
  if(!userId) throw new Error("DEV_USER_ID is not set in environment variables.");

  const [spending, recent, categories] = await Promise.all([
    getSpendingByCategory(userId, monthDate),
    getRecentTransactions(userId, monthDate, 5),
    getCategories(userId)
  ]);

  const totalCentavos = Math.abs(spending.reduce((sum, row) => sum + row.totalCentavos, 0));

  const rows: SpendingRowView[] = spending
    .map((r) => ({
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      amountCentavos: Math.abs(r.totalCentavos),
      percentage: totalCentavos === 0 ? 0 : (Math.abs(r.totalCentavos) / totalCentavos) * 100,
    }))
    .sort((a, b) => b.amountCentavos - a.amountCentavos);

  const isEmpty = rows.length === 0 && recent.length === 0;

  return (
    <main className="min-h-screen bg-finsight-background">
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-8 lg:px-6">
          <Header categories={categories} />

          <hr className="my-3 border-t border-gray-300 mb-10" />
          
          <DashboardHeader
            monthLabel={formatMonthYear(monthDate)}
            prevHref={`?month=${formatMonthParam(shiftMonth(parsed, -1))}`}
            nextHref={`?month=${formatMonthParam(shiftMonth(parsed, 1))}`}
          />

          {isEmpty ? (
            <p className="mt-8 text-center text-finsight-muted">No transactions in {formatMonthYear(monthDate)}.</p>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-5">
                <SummaryCard totalCentavos={totalCentavos} rangeLabel={formatMonthRange(monthDate)} />
                <SpendingBreakdown rows={rows} />
              </div>
              <Transactions transactions={recent} />
            </>
          )}

      </div>
    </main>
  )
}