import { PieChart } from 'lucide-react';

interface PensionPlan {
  id: string;
  name: string;
  provider: string;
  contribution: number;
  expectedReturn: number;
  riskLevel: string;
  balance: number;
  status: string;
}

interface PensionPlansProps {
  plans: PensionPlan[];
}

export default function PensionPlans({ plans }: PensionPlansProps) {
  return (
    <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
            <PieChart size={24} className="text-white" />
          </div>
          <div>
            <span>Pension Plans</span>
            <span className="ml-2 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-bold">
              {plans.length}
            </span>
          </div>
        </h3>
      </div>

      <div className="relative z-10 p-6 space-y-4">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className="group/plan relative border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg dark:hover:border-orange-500/30 transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover/plan:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors duration-300">Plan Name</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">{plan.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{plan.provider}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors duration-300">Balance</p>
                <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 bg-clip-text text-transparent">
                  KES {plan.balance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Current value</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors duration-300">Monthly Contribution</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">KES {plan.contribution.toLocaleString()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Regular payment</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors duration-300">Expected Return</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{plan.expectedReturn}%</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    plan.riskLevel === 'High' 
                      ? 'bg-red-500 dark:bg-red-400' 
                      : plan.riskLevel === 'Medium' 
                      ? 'bg-yellow-500 dark:bg-yellow-400' 
                      : 'bg-green-500 dark:bg-green-400'
                  }`}></span>
                  <p className={`text-xs font-bold transition-colors duration-300 ${
                    plan.riskLevel === 'High' 
                      ? 'text-red-600 dark:text-red-400' 
                      : plan.riskLevel === 'Medium' 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    Risk: {plan.riskLevel}
                  </p>
                </div>
              </div>
              
              <div className="flex items-end justify-start md:justify-end">
                <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-bold shadow-sm transition-colors duration-300">
                  {plan.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}