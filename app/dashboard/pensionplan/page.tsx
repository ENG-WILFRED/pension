"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { TrendingUp, Lock, Zap, Shield } from "lucide-react";

import AnimatedFooter from "@/app/components/AnimatedFooter";
export default function PensionPlansPage() {
  const myPlans = [
    { id: 1, name: 'Growth Pension', balance: 548000, contribution: 33000, performance: 12.5, manager: 'Equity Partners Ltd' },
    { id: 2, name: 'Balanced Pension', balance: 325000, contribution: 22000, performance: 8.2, manager: 'Asset Managers Kenya' },
    { id: 3, name: 'Conservative Pension', balance: 215000, contribution: 15000, performance: 5.1, manager: 'Fixed Income Fund' },
  ];

  const availablePlans = [
    { id: 4, name: 'Tech Innovation Fund', minContribution: 5000, expectedReturn: '14-18%', risk: 'High', icon: Zap },
    { id: 5, name: 'Real Estate Growth', minContribution: 10000, expectedReturn: '9-12%', risk: 'Medium', icon: TrendingUp },
    { id: 6, name: 'Bond Security Fund', minContribution: 3000, expectedReturn: '5-7%', risk: 'Low', icon: Shield },
    { id: 7, name: 'Mixed Portfolio', minContribution: 8000, expectedReturn: '8-11%', risk: 'Medium', icon: Lock },
  ];

  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [addingPlan, setAddingPlan] = useState(false);

  const handleAddPlan = (planId: number) => {
    setAddingPlan(true);
    setTimeout(() => {
      toast.success('Plan added to your portfolio');
      setAddingPlan(false);
      setSelectedPlan(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12"><div className="w-full  mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pension Plans</h1>
            <p className="text-gray-600 mt-2">Manage your active plans and explore new investment opportunities.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>

        {/* My Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.manager}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Current Balance</p>
                    <p className="text-xl font-bold text-gray-900">KES {plan.balance.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Monthly Contribution</p>
                      <p className="font-semibold">KES {plan.contribution.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">YTD Performance</p>
                      <p className="font-semibold text-green-600">+{plan.performance}%</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore & Add Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availablePlans.map(plan => {
              const Icon = plan.icon;
              const riskColor = plan.risk === 'Low' ? 'bg-green-50 text-green-700' : plan.risk === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700';
              return (
                <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer" onClick={() => setSelectedPlan(plan.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">Expected Return: <span className="font-semibold text-green-600">{plan.expectedReturn}</span></p>
                      <p className="text-sm text-gray-600">Min. Contribution: <span className="font-semibold">KES {plan.minContribution.toLocaleString()}</span></p>
                    </div>
                    <Icon size={32} className="text-indigo-500 flex-shrink-0" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskColor}`}>{plan.risk} Risk</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddPlan(plan.id); }} 
                      disabled={addingPlan} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                    >
                      {addingPlan ? 'Adding...' : 'Add Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
    </div>
  );
}
