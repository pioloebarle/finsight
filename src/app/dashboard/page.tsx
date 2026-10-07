import Header from './Header';
import DashboardHeader from './DashboardHeader';
import SpendingBreakdown from './SpendingBreakdown';
import SummaryCard from './SummaryCard';
import Transactions from './Transactions';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-finsight-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-6">
          <Header />

          <hr className="my-3 border-t border-gray-300 mb-10" />
          
          <DashboardHeader />

          <div className="grid gap-4 lg:grid-cols-5">  
            <SummaryCard />
            <SpendingBreakdown />
          </div>

          <Transactions />

      </div>
    </main>
  )
}