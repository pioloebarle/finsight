import { ArrowDown } from 'lucide-react';
import { totalCentavos } from './data/mockData';

export default function SummaryCard() {

    return (
        <div className="flex flex-col items-start justify-start bg-white p-10 rounded-finsight-lg border border-finsight-gray-500 lg:col-span-2">
            <p className='text-xl font-semibold mb-5'>Total spent this month</p>
            <div className="flex items-center gap-1">
            <span className="text-6xl font-bold text-gray-700">₱</span>
            <h1 className="text-7xl font-bold text-finsight-text">{(totalCentavos / 100).toFixed(2)}</h1>
            </div>
            <p className="text-finsight-muted mt-10 text-base">October 1 - October 31, 2026</p>
            
            <hr className="w-full my-6 border-t border-gray-300 mt-8" />

            <div className="flex items-center gap-3 mt-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-finsight-primary-soft">
                <ArrowDown
                className="h-6 w-6 text-finsight-primary"
                strokeWidth={2}
                />
            </div>

            <div>
                <p className="font-semibold text-base text-finsight-primary">
                On track with your budget
                </p>

                <p className="text-sm text-finsight-text-secondary">
                Spending is 12% lower than last month.
                </p>
            </div>
            </div>
        </div>
    )
}