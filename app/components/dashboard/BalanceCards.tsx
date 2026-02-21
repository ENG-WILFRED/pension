///home/hp/JERE/AutoNest/app/components/dashboard/BalanceCards.tsx
import { Wallet, TrendingUp, Clock } from 'lucide-react';

interface BalanceCardsProps {
  balance?: number;
  totalContributions?: number;
  projectedRetirement?: number;
  user?: {
    salary?: string | number;
    contributionRate?: string | number;
    dateOfBirth?: string;
    retirementAge?: number;
    createdAt?: string;
  };
}

export default function BalanceCards({ balance, totalContributions, projectedRetirement, user }: BalanceCardsProps) {
  // Use actual backend data for balance and contributions
  const totalBalance = balance || 0;
  const projectedAt65 = projectedRetirement || 0;
  const defaultRetirementAge = user?.retirementAge || 60;
  const earlyRetirementAge = 55;

  // Calculate years to retirement
  const calculateYearsToRetirement = (): number => {
    if (user?.dateOfBirth) {
      const birthDate = new Date(user.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return Math.max(0, defaultRetirementAge - age);
    }
    return Math.max(0, defaultRetirementAge - 30);
  };

  const yearsToRetirement = calculateYearsToRetirement();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance - Orange to Purple Luxury */}
      <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-purple-600 dark:from-orange-600 dark:via-orange-700 dark:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 dark:hover:shadow-orange-700/50 p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-orange-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-bold tracking-wide opacity-95">Total Balance</h4>
            <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-md shadow-lg group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Wallet size={22} className="drop-shadow-lg" />
            </div>
          </div>
          <p className="text-4xl font-black mb-2 drop-shadow-md tracking-tight">KES {totalBalance.toLocaleString()}</p>
          <p className="text-orange-50/90 text-xs font-medium tracking-wide">Across all plans</p>
        </div>
      </div>

      {/* (Monthly Contribution card removed) */}

      {/* Projected at Retirement - Orange to Indigo Luxury */}
      <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-indigo-600 dark:from-orange-600 dark:via-orange-700 dark:to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 dark:hover:shadow-orange-700/50 p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-orange-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm font-bold tracking-wide opacity-95">Projected @ {defaultRetirementAge}</h4>
            <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-md shadow-lg group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <TrendingUp size={22} className="drop-shadow-lg" />
            </div>
          </div>
          <p className="text-4xl font-black mb-2 drop-shadow-md tracking-tight">KES {projectedAt65.toLocaleString()}</p>
          <p className="text-orange-50/90 text-xs font-medium tracking-wide">for KES 100 daily savings</p>
        </div>
      </div>

      {/* Years to Retirement - Orange to Pink Luxury */}
      <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 dark:from-orange-600 dark:via-orange-700 dark:to-pink-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 dark:hover:shadow-orange-700/50 p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-orange-400/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-bold tracking-wide opacity-95">Years to Retirement</h4>
            <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-md shadow-lg group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
              <Clock size={22} className="drop-shadow-lg" />
            </div>
          </div>
          <p className="text-4xl font-black mb-2 drop-shadow-md tracking-tight">{yearsToRetirement}</p>
          <p className="text-orange-50/90 text-xs font-medium tracking-wide">Target age: {defaultRetirementAge}</p>
          <p className="text-orange-50/90 text-xs font-medium tracking-wide">Early retirement age: {earlyRetirementAge}</p>
        </div>
      </div>
    </div>
  );
}