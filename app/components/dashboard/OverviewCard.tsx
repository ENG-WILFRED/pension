import React from "react";

interface OverviewCardProps {
  weekContribution: number;
  weekInterest: number;
  ytdContribution: number;
  ytdInterest: number;
}

const currency = (n: number) => n.toLocaleString("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

export default function OverviewCard({ weekContribution, weekInterest, ytdContribution, ytdInterest }: OverviewCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col gap-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">This week</span>
          <span className="text-sm text-gray-700 dark:text-gray-200">Total Contribution</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">{currency(weekContribution)}</span>
          <span className="text-sm text-gray-700 dark:text-gray-200 mt-2">Total Interest Accrued</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{currency(weekInterest)}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Year to Date</span>
          <span className="text-sm text-gray-700 dark:text-gray-200">Total Contribution</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">{currency(ytdContribution)}</span>
          <span className="text-sm text-gray-700 dark:text-gray-200 mt-2">Total Interest Accrued</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{currency(ytdInterest)}</span>
        </div>
      </div>
    </div>
  );
}
