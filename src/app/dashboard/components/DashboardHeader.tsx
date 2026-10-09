"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardHeader({ monthLabel, prevHref, nextHref }: { monthLabel: string; prevHref: string; nextHref: string }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-base text-finsight-muted">Your Spending</p>
              <h2 className="text-3xl font-semibold text-finsight-text">{monthLabel}</h2> {/* Change to actual data */}
            </div>
            <div className="flex items-center justify-center gap-5 bg-white p-2 rounded-finsight-lg border border-finsight-gray-500">
              <button 
                onClick = {() => window.location.href = prevHref} 
                className="flex items-center justify-center"
              > 
                <ChevronLeft className="w-5 h-5 text-finsight-primary" />
              </button>
              <span className="mx-2 font-semibold">{monthLabel}</span>
              <button
                onClick = {() => window.location.href = nextHref} 
                className="flex items-center justify-center text-finsight-primary"
              > 
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
        </div>
    )
}