import { User } from 'lucide-react';

interface PensionDetailsProps {
  accountNumber?: string;
  contributionRate?: string | number;
  retirementAge?: number;
}

export default function PensionDetails({
  accountNumber,
  contributionRate,
  retirementAge,
}: PensionDetailsProps) {

  const formatRate = typeof contributionRate === 'string' && !contributionRate.includes('%')
    ? `${contributionRate}%`
    : (contributionRate || '2%');

  // Format account number with leading zeros (e.g., 9 -> 00000009)
  const formatAccountNumber = (id: string | undefined): string => {
    if (!id) return '—';
    const numId = parseInt(id, 10);
    return numId.toString().padStart(8, '0');
  };

  const displayAccount = accountNumber ? `AutoNest ID:${formatAccountNumber(accountNumber)}` : 'AutoNest ID:—';

  return (
    <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2 transition-colors duration-300">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
            <User size={20} className="text-white" />
          </div>
          Pension Details
        </h3>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">&nbsp;</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{displayAccount}</span>
          </div>

          <div className="flex justify-between items-center border-t-2 border-orange-100 dark:border-orange-900/30 pt-3 mt-3 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Contribution Rate:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">{formatRate}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Retirement Age</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{retirementAge || 60}</span>
          </div>

          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Early Retirement Age</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">55</span>
          </div>
        </div>
      </div>
    </div>
  );
}