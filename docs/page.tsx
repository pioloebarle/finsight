// src/app/page.tsx
// UI ONLY. Every "LOGIC:" comment marks something you wire up yourself.
// Assumes Next.js App Router + Tailwind (what create-next-app gave you). No new dependencies.
//
// Palette (all default Tailwind, so no config needed):
//   background slate-50 · surface white · text slate-900 · muted slate-500 · border slate-200
//   primary teal-700 (hover teal-800) · warning amber · error red

import Link from "next/link";

// ---------- Types ----------
// The components below take DISPLAY-READY data. Turning your query result into this shape
// is part of your logic (see the mapping comment in DashboardPage).
type SpendingRowView = {
  categoryId: string | null; // null = the "Uncategorized" group
  categoryName: string;
  amount: string; // already formatted, e.g. "₱240.20"
  sharePercent: number; // 0-100, this row's share of the month's total
};

type ViewState = "ready" | "empty" | "error" | "loading";

// ---------- Shared styles (one definition so buttons never drift apart) ----------
const primaryButton =
  "inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800 active:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

const card = "overflow-hidden rounded-xl border border-slate-200 bg-white";

// ---------- Page ----------
export default function DashboardPage() {
  // LOGIC: replace this with real state. Change the string to preview each UI state.
  //   "ready"   -> rows.length > 0
  //   "empty"   -> query returned []
  //   "error"   -> the ?month= value failed Zod validation (or the query threw)
  //   "loading" -> normally handled by a src/app/loading.tsx file, not by a variable
  const view = "ready" as ViewState;

  // LOGIC: month from the URL.
  //   - Make this component `async` and accept `{ searchParams }` (a Promise in current Next.js, so `await` it).
  //   - Validate with the same Zod schema as your API route; fall back to the current month (UTC).
  const monthLabel = "October 2026"; // Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric", timeZone: "UTC" })
  const prevHref = "?month=2026-09"; // addMonths(month, -1), watch the January rollover
  const nextHref = "?month=2026-11"; // addMonths(month, +1), watch the December rollover

  // LOGIC: data.
  //   const rows = await getSpendingByCategory(userId, date);   // userId: process.env.DEV_USER_ID for now
  //   const totalCentavos = rows.reduce((sum, r) => sum + r.totalCentavos, 0);   // stay in integer centavos
  //   Then map each row to SpendingRowView:
  //     amount       -> Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Math.abs(r.totalCentavos) / 100)
  //     sharePercent -> Math.abs(r.totalCentavos) / Math.abs(totalCentavos) * 100
  //   Sort so the biggest spend comes first (more negative = bigger spend).
  const rows: SpendingRowView[] = [
    { categoryId: "1", categoryName: "Bills", amount: "₱240.20", sharePercent: 35.7 },
    { categoryId: "2", categoryName: "Internet", amount: "₱178.00", sharePercent: 26.4 },
    { categoryId: "3", categoryName: "Grocery", amount: "₱157.88", sharePercent: 23.4 },
    { categoryId: null, categoryName: "Uncategorized", amount: "₱56.45", sharePercent: 8.4 },
    { categoryId: "4", categoryName: "Food", amount: "₱24.81", sharePercent: 3.7 },
    { categoryId: "5", categoryName: "Subscriptions", amount: "₱15.99", sharePercent: 2.4 },
  ];
  const totalLabel = "₱673.33"; // the same formatted total, computed once and reused

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <PageHeader />

        <div className="mt-6 flex justify-center sm:justify-start">
          <MonthSwitcher label={monthLabel} prevHref={prevHref} nextHref={nextHref} />
        </div>

        {view === "loading" && <LoadingSkeleton />}
        {view === "error" && <ErrorState />}
        {view === "empty" && <EmptyState monthLabel={monthLabel} />}
        {view === "ready" && (
          <>
            <TotalSummary totalLabel={totalLabel} monthLabel={monthLabel} />
            <SpendingTable rows={rows} totalLabel={totalLabel} monthLabel={monthLabel} />
          </>
        )}
      </main>
    </div>
  );
}

// ---------- Components ----------

function PageHeader() {
  return (
    <header className="flex items-center justify-between">
      <span className="text-lg font-bold tracking-tight">Finsight</span>

      {/* The one primary action on this page.
          LOGIC: this route doesn't exist yet. Build /transactions/new later (the "Transaction CRUD" step). */}
      <Link href="/transactions/new" className={primaryButton}>
        Add transaction
      </Link>
    </header>
  );
}

function MonthSwitcher({
  label,
  prevHref,
  nextHref,
}: {
  label: string;
  prevHref: string;
  nextHref: string;
}) {
  const arrow =
    "grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700";

  return (
    <nav
      aria-label="Choose month"
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1"
    >
      <Link href={prevHref} aria-label="Previous month" className={arrow}>
        &#8249;
      </Link>
      <span className="min-w-36 text-center text-sm font-medium">{label}</span>
      {/* LOGIC (optional): disable "next" when it would point to a future month. */}
      <Link href={nextHref} aria-label="Next month" className={arrow}>
        &#8250;
      </Link>
    </nav>
  );
}

function TotalSummary({ totalLabel, monthLabel }: { totalLabel: string; monthLabel: string }) {
  return (
    // aria-live so screen readers announce the new total after the month changes
    <section aria-live="polite" className="mt-8 mb-6">
      <p className="text-sm text-slate-500">Total spent in {monthLabel}</p>
      <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{totalLabel}</p>
    </section>
  );
}

function SpendingTable({
  rows,
  totalLabel,
  monthLabel,
}: {
  rows: SpendingRowView[];
  totalLabel: string;
  monthLabel: string;
}) {
  return (
    <div className={card}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Spending by category for {monthLabel}</caption>
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th scope="col" className="px-4 py-3 font-medium sm:px-5">Category</th>
            {/* The bar column is hidden on phones; the percentage under the amount keeps the info. */}
            <th scope="col" className="hidden w-2/5 px-5 py-3 font-medium sm:table-cell">Share of spending</th>
            <th scope="col" className="px-4 py-3 text-right font-medium sm:px-5">Amount</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {/* LOGIC: one <tr> per row. Use key={row.categoryId ?? "uncategorized"} because the null group has no id. */}
          {rows.map((row) => (
            <tr key={row.categoryId ?? "uncategorized"}>
              <td className="px-4 py-3.5 sm:px-5">
                {row.categoryId === null ? (
                  // Warning color is reserved for "needs your attention".
                  // LOGIC (later): link this to a screen where the user assigns categories.
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="italic text-slate-500">{row.categoryName}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Needs a category
                    </span>
                  </span>
                ) : (
                  row.categoryName
                )}
              </td>

              <td className="hidden px-5 py-3.5 sm:table-cell">
                {/* Decorative: the number next to it carries the same information. */}
                <div aria-hidden="true" className="h-2.5 rounded-full bg-teal-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${row.sharePercent}%` }}
                  />
                </div>
              </td>

              <td className="px-4 py-3.5 text-right tabular-nums sm:px-5">
                <span className="font-medium">{row.amount}</span>
                <span className="ml-2 text-xs text-slate-500">{Math.round(row.sharePercent)}%</span>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="border-t border-slate-200 bg-slate-50 font-bold">
            <td className="px-4 py-3.5 sm:px-5">Total</td>
            <td className="hidden sm:table-cell" />
            <td className="px-4 py-3.5 text-right tabular-nums sm:px-5">{totalLabel}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function EmptyState({ monthLabel }: { monthLabel: string }) {
  // LOGIC: render this when rows.length === 0. The API returns [] for empty months, so it's not an error.
  return (
    <section className={`${card} mt-8 px-6 py-12 text-center`}>
      <h2 className="text-lg font-bold">No expenses in {monthLabel}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        Add a transaction or import a statement and it will show up here.
      </p>
      <Link href="/transactions/new" className={`${primaryButton} mt-6`}>
        Add transaction
      </Link>
    </section>
  );
}

function ErrorState() {
  // LOGIC: pick ONE behavior and keep it consistent with the API route's 400:
  //   (a) silently fall back to the current month, or (b) show this with a link back.
  return (
    <section
      role="alert"
      className="mt-8 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <h2 className="text-lg font-bold text-red-800">That month isn&apos;t valid</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-red-700">
        Use the format YYYY-MM, for example 2026-10.
      </p>
      <Link href="/" className={`${primaryButton} mt-6`}>
        Go to this month
      </Link>
    </section>
  );
}

function LoadingSkeleton() {
  // LOGIC: in the real app, put this component in src/app/loading.tsx.
  // Next.js shows that file automatically while the page's data is being fetched.
  // motion-reduce turns the pulse off for people who prefer less motion.
  return (
    <div aria-busy="true" aria-label="Loading spending" className="mt-8">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-3 h-14 w-64 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className={`${card} mt-6 divide-y divide-slate-200`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
