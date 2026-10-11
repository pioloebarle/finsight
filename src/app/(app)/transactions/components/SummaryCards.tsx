import type { TransactionRecord } from "@/lib/queries/getTransactions";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";

type SummaryCardsProps = {
    transactions: TransactionRecord[];
};

export default function SummaryCards({ transactions }: SummaryCardsProps){

    const income = transactions.reduce((total, transaction) =>
        transaction.amountCentavos > 0 ? total + transaction.amountCentavos : total,
        0
    )

    const expenses = transactions.reduce((total, transaction) => 
        transaction.amountCentavos < 0 ? total + transaction.amountCentavos : total,
        0
    )

    const net = income - Math.abs(expenses);

    const summary = [
        {
            title: "Income",
            value: formatCurrency(income),
            valueClass: "text-finsight-income",
        },
        {
            title: "Expenses",
            value: formatCurrency(expenses),
            valueClass: "text-finsight-expense",
        },
        {
            title: "Net",
            value: formatSignedCurrency(net),
            valueClass:
                net > 0
                    ? "text-finsight-income"
                    : net < 0
                      ? "text-finsight-expense"
                      : "text-finsight-text",
        },
    ];

    return (
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

                    <p
                        className={`mt-2 text-xl font-semibold sm:text-2xl ${item.valueClass}`}
                    >
                        {item.value}
                    </p>
                </div>
            ))}
        </section>
    );
}