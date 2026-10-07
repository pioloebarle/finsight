import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-base text-finsight-muted">Your Spending</p>
              <h2 className="text-3xl font-semibold text-finsight-text">October 2026</h2> {/* Change to actual data */}
            </div>
            <div className="flex items-center justify-center gap-5 bg-white p-2 rounded-finsight-lg border border-finsight-gray-500">
              <button className="flex items-center justify-center"> {/* Add onclick handler */}
                <ChevronLeft className="w-5 h-5 text-finsight-primary" />
              </button>
              <span className="mx-2 font-semibold">October 2026</span>
              <button className="flex items-center justify-center text-finsight-primary"> {/* Add onclick handler */}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
        </div>
    )
}