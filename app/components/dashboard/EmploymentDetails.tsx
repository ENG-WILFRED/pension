import { User } from 'lucide-react';

interface EmploymentDetailsProps {
  employer?: string;
  occupation?: string;
  salary?: string | number;
  contributionRate?: string | number;
  retirementAge?: number;
}

export default function EmploymentDetails({ 
  employer, 
  occupation, 
  salary, 
  contributionRate, 
  retirementAge 
}: EmploymentDetailsProps) {
  const salaryNum = typeof salary === 'string' ? parseInt(salary) : (salary || 85000);
  const formatRate = typeof contributionRate === 'string' && !contributionRate.includes('%') 
    ? `${contributionRate}%` 
    : (contributionRate || '2%');
  
  return (
    <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2 transition-colors duration-300">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
            <User size={20} className="text-white" />
          </div>
          Employment Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Employer:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{employer || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Occupation:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{occupation || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Status:</span>
            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold shadow-sm transition-colors duration-300">
              Employed
            </span>
          </div>
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Monthly Salary:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">KES {salaryNum.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-t-2 border-orange-100 dark:border-orange-900/30 pt-3 mt-3 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Contribution Rate:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">{formatRate}</span>
          </div>
          {retirementAge && (
            <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Retirement Age:</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{retirementAge}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}