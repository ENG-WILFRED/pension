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
    <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="relative z-10 px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
            <PieChart size={22} className="text-white" />
          </div>
          <span>Pension Plans</span>
          <span className="px-2.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-bold">
            {plans.length}
          </span>
        </h3>
      </div>

      {/* Plans List */}
      <div className="relative z-10 p-6">
        {plans.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No pension plans found.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group/plan relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:border-orange-500/30 transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover/plan:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 w-full">
                  {/* Column Headers */}
                  <div className="grid px-6 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700/50"
                    style={{ gridTemplateColumns: '2fr 1.5fr 1.8fr 1.5fr 100px' }}>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plan Name</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Balance</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Monthly Contribution</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Expected Return</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest"></p>
                  </div>

                  {/* Values */}
                  <div className="grid items-center px-6 py-4"
                    style={{ gridTemplateColumns: '2fr 1.5fr 1.8fr 1.5fr 100px' }}>

                    {/* Plan Name */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{plan.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{plan.provider}</p>
                    </div>

                    {/* Balance */}
                    <div>
                      <p className="text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        KES {plan.balance.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Current value</p>
                    </div>

                    {/* Monthly Contribution */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        KES {plan.contribution.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Regular payment</p>
                    </div>

                    {/* Expected Return */}
                    <div>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">{plan.expectedReturn}%</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          plan.riskLevel === 'High'
                            ? 'bg-red-500'
                            : plan.riskLevel === 'Medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`} />
                        <p className={`text-xs font-semibold ${
                          plan.riskLevel === 'High'
                            ? 'text-red-500 dark:text-red-400'
                            : plan.riskLevel === 'Medium'
                            ? 'text-yellow-500 dark:text-yellow-400'
                            : 'text-green-500 dark:text-green-400'
                        }`}>
                          Risk: {plan.riskLevel}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-end">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap ${
                        plan.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : plan.status === 'SUSPENDED'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {plan.status}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}