"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calculator, Target, Clock, DollarSign } from "lucide-react";

const currency = (n: number) =>
  n.toLocaleString("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function InputField({ label, value, onChange, min, max, step = 1, prefix, suffix }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2">
        {prefix && <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-gray-900 dark:text-white font-semibold outline-none text-sm"
        />
        {suffix && <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{suffix}</span>}
      </div>
      {min !== undefined && max !== undefined && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="accent-orange-500 w-full h-1.5 mt-1 cursor-pointer"
        />
      )}
    </div>
  );
}

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(5);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);

  const [result, setResult] = useState({
    projectedSavings: 0,
    realValue: 0,
    monthlyIncome: 0,
    yearsToRetirement: 0,
    replacementRatio: 0,
    shortfall: 0,
  });

  useEffect(() => {
    const years = Math.max(0, retirementAge - currentAge);
    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;

    const fvCurrentSavings = currentSavings * Math.pow(1 + annualReturn / 100, years);

    const fvContributions =
      monthlyRate > 0
        ? monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : monthlyContribution * months;

    const projectedSavings = fvCurrentSavings + fvContributions;
    const realValue = projectedSavings / Math.pow(1 + inflationRate / 100, years);
    const monthlyIncome = (projectedSavings * 0.04) / 12;
    const replacementRatio = monthlyExpenses > 0 ? (monthlyIncome / monthlyExpenses) * 100 : 0;
    const requiredNest = monthlyExpenses * 12 * 25;
    const shortfall = Math.max(0, requiredNest - projectedSavings);

    setResult({ projectedSavings, realValue, monthlyIncome, yearsToRetirement: years, replacementRatio, shortfall });
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, inflationRate, monthlyExpenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
          <Calculator size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Retirement Calculator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Project your savings and plan your future</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Inputs ── */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 space-y-5 transition-colors duration-300 h-fit">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Details</h3>
          <InputField label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={70} suffix="yrs" />
          <InputField label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={50} max={80} suffix="yrs" />
          <InputField label="Current Savings" value={currentSavings} onChange={setCurrentSavings} min={0} max={10000000} step={1000} prefix="KES" />
          <InputField label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} min={0} max={500000} step={500} prefix="KES" />
          <InputField label="Expected Annual Return" value={annualReturn} onChange={setAnnualReturn} min={1} max={20} step={0.5} suffix="%" />
          <InputField label="Expected Inflation Rate" value={inflationRate} onChange={setInflationRate} min={1} max={15} step={0.5} suffix="%" />
          <InputField label="Monthly Expenses (Today)" value={monthlyExpenses} onChange={setMonthlyExpenses} min={0} max={500000} step={1000} prefix="KES" />
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4 stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Projected Savings */}
            <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-purple-600 dark:from-orange-600 dark:via-orange-700 dark:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold opacity-90">Projected Savings</span>
                  <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <p className="text-3xl font-black mb-1 tracking-tight">{currency(result.projectedSavings)}</p>
                <p className="text-orange-50/80 text-xs">At age {retirementAge}</p>
              </div>
            </div>

            {/* Real Value */}
            <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-indigo-600 dark:from-orange-600 dark:via-orange-700 dark:to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold opacity-90">Real Value (Inflation Adj.)</span>
                  <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <DollarSign size={18} />
                  </div>
                </div>
                <p className="text-3xl font-black mb-1 tracking-tight">{currency(result.realValue)}</p>
                <p className="text-orange-50/80 text-xs">Today's purchasing power</p>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 dark:from-orange-600 dark:via-orange-700 dark:to-pink-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold opacity-90">Monthly Retirement Income</span>
                  <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Target size={18} />
                  </div>
                </div>
                <p className="text-3xl font-black mb-1 tracking-tight">{currency(result.monthlyIncome)}</p>
                <p className="text-orange-50/80 text-xs">Based on 4% withdrawal rule</p>
              </div>
            </div>

            {/* Years to Retirement */}
            <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 dark:from-orange-600 dark:via-orange-700 dark:to-rose-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold opacity-90">Years to Retirement</span>
                  <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Clock size={18} />
                  </div>
                </div>
                <p className="text-3xl font-black mb-1 tracking-tight">{result.yearsToRetirement} yrs</p>
                <p className="text-orange-50/80 text-xs">Retiring at age {retirementAge}</p>
              </div>
            </div>
          </div>

          {/* Savings Breakdown — contribution items removed */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Retirement Outlook</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Income Replacement Ratio */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Income Replacement Ratio</span>
                <p className={`text-2xl font-bold mt-2 ${
                  result.replacementRatio >= 80
                    ? "text-green-600 dark:text-green-400"
                    : result.replacementRatio >= 50
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {result.replacementRatio.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: ≥80%</p>
                {/* Mini progress bar */}
                <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.replacementRatio >= 80 ? "bg-green-500" : result.replacementRatio >= 50 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, result.replacementRatio)}%` }}
                  />
                </div>
              </div>

              {/* Savings Shortfall */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Savings Shortfall</span>
                <p className={`text-2xl font-bold mt-2 ${
                  result.shortfall === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {result.shortfall === 0 ? "On Track! ✓" : currency(result.shortfall)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.shortfall === 0
                    ? "Your savings exceed the target nest egg"
                    : `Need ${currency(monthlyExpenses * 12 * 25)} total (25× annual expenses)`}
                </p>
              </div>

              {/* Projected Monthly Income vs Expenses */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Income at Retirement</span>
                <p className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">{currency(result.monthlyIncome)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs KES {monthlyExpenses.toLocaleString()} current expenses</p>
              </div>

              {/* Real Purchasing Power */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Inflation-Adjusted Nest Egg</span>
                <p className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400">{currency(result.realValue)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  At {inflationRate}% inflation over {result.yearsToRetirement} years
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">💡 Insights</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {result.replacementRatio >= 80 && result.shortfall === 0 ? (
                <li className="flex gap-2">
                  <span className="text-green-500 text-base">•</span>
                  Great work! You're on track for a comfortable retirement with an income replacement ratio of {result.replacementRatio.toFixed(1)}%.
                </li>
              ) : (
                <>
                  {result.replacementRatio < 80 && (
                    <li className="flex gap-2">
                      <span className="text-orange-500 text-base">•</span>
                      Your income replacement ratio is {result.replacementRatio.toFixed(1)}%, below the recommended 80%. Consider increasing your monthly contribution or adjusting your retirement age.
                    </li>
                  )}
                  {result.shortfall > 0 && (
                    <li className="flex gap-2">
                      <span className="text-red-500 text-base">•</span>
                      You have a projected shortfall of {currency(result.shortfall)}. Saving more each month or starting earlier can close this gap.
                    </li>
                  )}
                </>
              )}
              <li className="flex gap-2">
                <span className="text-blue-500 text-base">•</span>
                At {annualReturn}% annual return, your money doubles approximately every {(72 / annualReturn).toFixed(1)} years (Rule of 72).
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500 text-base">•</span>
                Delaying retirement by just 2 years to age {retirementAge + 2} could significantly boost your nest egg through additional savings and compound growth.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}