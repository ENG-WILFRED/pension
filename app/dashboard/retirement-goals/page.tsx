"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Lightbulb, Target, TrendingUp, Calendar } from "lucide-react";
import AnimatedFooter from "@/app/components/AnimatedFooter";

export default function RetirementGoalsPage() {
  const [targetAge, setTargetAge] = useState(65);
  const [currentAge, setCurrentAge] = useState(35);
  const [monthly, setMonthly] = useState(5000);
  const [currentBalance, setCurrentBalance] = useState(1088000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [projected, setProjected] = useState<any | null>(null);

  const calculate = () => {
    const years = targetAge - currentAge;
    if (years <= 0) {
      toast.error('Retirement age must be in the future');
      return;
    }
    const monthlyReturn = annualReturn / 100 / 12;
    let futureValue = currentBalance * Math.pow(1 + annualReturn / 100, years);
    const monthlyContributions = monthly * 12 * (Math.pow(1 + annualReturn / 100, years) - 1) / (annualReturn / 100);
    futureValue += monthlyContributions;
    const monthlyIncome = futureValue * 0.04 / 12; // 4% withdrawal rule
    setProjected({
      futureValue: Math.round(futureValue),
      monthlyIncome: Math.round(monthlyIncome),
      years,
      totalContributed: Math.round(currentBalance + monthly * 12 * years)
    });
    toast.success('Retirement plan calculated');
  };

  const goals = [
    { label: 'Comfortable Retirement', amount: 5000000, icon: Target },
    { label: 'Healthcare Fund', amount: 1000000, icon: Lightbulb },
    { label: 'Emergency Reserve', amount: 500000, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col\">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12\">
        <div className="w-full mx-auto\">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Retirement Goals & Projections</h1>
            <p className="text-gray-600 mt-2">Plan your retirement and see detailed projections based on your contributions and investment returns.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal, i) => {
            const Icon = goal.icon;
            return (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={24} className="text-indigo-600" />
                  <h3 className="font-bold text-gray-900">{goal.label}</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">KES {goal.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">Target amount</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Age</label>
                <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="mt-1 w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Retirement Age</label>
                <input type="number" value={targetAge} onChange={(e) => setTargetAge(Number(e.target.value))} className="mt-1 w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Balance (KES)</label>
                <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="mt-1 w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Contribution (KES)</label>
                <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1 w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Annual Return (%)</label>
                <input type="number" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="mt-1 w-full border border-gray-300 p-3 rounded-lg" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={calculate} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Calculate</button>
                <button onClick={() => { setProjected(null); toast('Form reset'); }} className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition">Reset</button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Projection</h2>
            {projected ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-2">Projected Retirement Pot</p>
                  <p className="text-3xl font-bold text-green-900">KES {projected.futureValue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-2">At age {targetAge} (in {projected.years} years)</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-2">Monthly Income at Retirement</p>
                  <p className="text-2xl font-bold text-blue-900">KES {projected.monthlyIncome.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-2">Using 4% withdrawal rule</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium">Total Contributed</p>
                    <p className="text-lg font-bold text-gray-900">KES {projected.totalContributed.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium">Investment Growth</p>
                    <p className="text-lg font-bold text-gray-900">KES {(projected.futureValue - projected.totalContributed).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-xs text-indigo-600 font-medium mb-2">Retirement Readiness</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(100, (projected.futureValue / 5000000) * 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-indigo-600 mt-2">{Math.round(Math.min(100, (projected.futureValue / 5000000) * 100))}% towards KES 5M goal</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your details and click Calculate to see your projection</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
    </div>
  );
}
