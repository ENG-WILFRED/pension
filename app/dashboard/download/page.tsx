"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Download, FileText, BarChart3 } from "lucide-react";
import AnimatedFooter from "@/app/components/AnimatedFooter";

export default function DownloadStatementPage() {
  const [plan, setPlan] = useState("all");
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-12-22");
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 'all', name: 'All Plans', transactions: 36 },
    { id: 'growth', name: 'Growth Pension', transactions: 12 },
    { id: 'balanced', name: 'Balanced Pension', transactions: 12 },
    { id: 'conservative', name: 'Conservative Pension', transactions: 12 },
  ];

  const generateStatementData = () => {
    let rows = ['Date,Plan,Description,Amount,Balance'];
    const transactions = [
      { date: '2025-12-01', plan: 'Growth Pension', desc: 'Monthly Contribution', amt: 5000, bal: 548000 },
      { date: '2025-11-01', plan: 'Growth Pension', desc: 'Monthly Contribution', amt: 5000, bal: 543000 },
      { date: '2025-10-15', plan: 'Growth Pension', desc: 'Dividend Distribution', amt: 2150, bal: 538000 },
      { date: '2025-10-01', plan: 'Growth Pension', desc: 'Monthly Contribution', amt: 5000, bal: 535850 },
      { date: '2025-09-01', plan: 'Balanced Pension', desc: 'Monthly Contribution', amt: 3333, bal: 325000 },
      { date: '2025-08-20', plan: 'Balanced Pension', desc: 'Rebalancing Fee', amt: -150, bal: 321667 },
      { date: '2025-07-15', plan: 'Conservative Pension', desc: 'Interest Payment', amt: 1250, bal: 215000 },
      { date: '2025-07-01', plan: 'Conservative Pension', desc: 'Monthly Contribution', amt: 2500, bal: 213750 },
    ];
    rows.push(...transactions.map(t => `${t.date},${t.plan},${t.desc},${t.amt},${t.bal}`));
    return rows.join('\n');
  };

  const handleGenerate = async () => {
    if (!from || !to) {
      toast.error('Please select date range');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      const csv = generateStatementData();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pension_statement_${plan}_${from}_${to}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Statement exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to generate statement');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === plan);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12\">
        <div className="w-full mx-auto\">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Download Statement</h1>
            <p className="text-gray-600 mt-2">Export your pension transactions and activity reports in your preferred format.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <FileText size={32} className="text-indigo-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Statement Format</h3>
            <p className="text-sm text-gray-600">Export as CSV, PDF, or Excel</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <BarChart3 size={32} className="text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Date Range</h3>
            <p className="text-sm text-gray-600">Flexible period selection</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <Download size={32} className="text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Instant Download</h3>
            <p className="text-sm text-gray-600">Ready to use records</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Your Statement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Plan</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">{selectedPlanData?.transactions} transactions available</p>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="pdf">PDF (Print-friendly)</option>
                <option value="xlsx">Excel (Advanced)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Choose format for your records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">📄 Your statement will include all transactions, contributions, dividends, and fee deductions for the selected period and plan.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {loading ? 'Generating...' : 'Generate & Download'}
            </button>
            <button 
              onClick={() => { setPlan('all'); setFrom('2025-01-01'); setTo('2025-12-22'); toast('Form reset'); }} 
              className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
    </div>
  );
}
