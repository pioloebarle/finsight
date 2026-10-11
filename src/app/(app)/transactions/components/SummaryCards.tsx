const summary = [
    { title: "Income", value: "₱ 12,345.67" },
    { title: "Expenses", value: "₱ 8,765.43" },
    { title: "Net", value: "+₱ 3,580.24" },
];

export default function SummaryCards(){
    return (
        <div>
            {/* Summary Cards */}
            <section
                aria-label="Transaction summary"
                className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
            >
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-finsight-lg border border-finsight-gray-500 bg-finsight-surface p-4"
                    >
                        <h2 className="text-sm font-medium text-finsight-secondary sm:text-base">
                            {item.title}
                        </h2>

                        <p className="mt-2 text-xl font-semibold text-finsight-text sm:text-2xl">
                            {item.value}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    )
}