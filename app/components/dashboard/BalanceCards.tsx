import { Wallet, ArrowDownRight, TrendingUp, Clock } from 'lucide-react';

interface BalanceCardsProps {
  balance: number;
  totalContributions: number;
  projectedRetirement: number;
}

export default function BalanceCards({ balance, totalContributions, projectedRetirement }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Total Balance</h4>
          <Wallet size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {balance.toLocaleString()}</p>
        <p className="text-indigo-100 text-xs mt-2">Across all plans</p>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Monthly Contribution</h4>
          <ArrowDownRight size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {totalContributions.toLocaleString()}</p>
        <p className="text-emerald-100 text-xs mt-2">Total allocated</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Projected @ 65</h4>
          <TrendingUp size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">KES {projectedRetirement.toLocaleString()}</p>
        <p className="text-pink-100 text-xs mt-2">8% annual growth</p>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold opacity-90">Years to Retirement</h4>
          <Clock size={20} className="opacity-75" />
        </div>
        <p className="text-3xl font-bold">35</p>
        <p className="text-red-100 text-xs mt-2">Target age: 65</p>
      </div>
    </div>
  );
}
