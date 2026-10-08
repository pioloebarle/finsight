import type { SpendingRowView } from "@/types/dashboard";
import { getCategoryConfig } from "../data/categories";

export default function SpendingBreakdown({ rows }: {rows: SpendingRowView[]}) {

    return (
        <div className=" p-6 bg-white rounded-finsight-lg border border-finsight-gray-500 w-full lg:col-span-3">
            <p className='text-xl font-semibold mb-4'>Spending breakdown</p>
            
            <div className="w-full">
            {rows.map((row) => {
                const config = getCategoryConfig(row.categoryName);

                const Icon = config.icon;
                return (
                <div
                    key={row.categoryId ?? "uncategorized"}
                    className="flex w-full items-center gap-4 border-b border-finsight-border-light py-2 last:border-b-0"
                >
                    {/* Icon */}
                    <div className="flex shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft p-2.5">
                    <Icon className="h-5 w-5 text-finsight-primary" />
                    </div>

                    {/* Category name: fixed width so the bars all start at the same x */}
                    <p className="w-36 shrink-0 text-base font-semibold capitalize text-finsight-text">
                    {config.name}
                    </p>

                    {/* Progress bar: fills the leftover space */}
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-finsight-primary-soft">
                    <div
                        className="h-full rounded-full bg-finsight-primary"
                        style={{ width: `${row.percentage}%` }}
                    />
                    </div>

                    {/* Amount */}
                    <span className="w-24 shrink-0 text-right text-sm font-medium">
                    ₱{(row.amountCentavos / 100).toFixed(2)}
                    </span>

                    {/* Percentage */}
                    <span className="w-10 shrink-0 text-right text-sm text-finsight-muted">
                    {row.percentage.toFixed(0)}%
                    </span>
                </div>
                )
            })}
            </div>
        </div>
    )
}