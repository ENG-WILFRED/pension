///home/hp/JERE/pension/app/dashboard/admin/reports/page.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

export default function AdminReports() {
  const [reportType, setReportType] = useState('monthly');
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-12-22');
  const [generating, setGenerating] = useState(false);

  const handleExportReport = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    toast.success(`${reportType} report exported successfully`);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-green-50 to-emerald-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Generate and export financial and member reports.</p>
            </div>
            <Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">← Back to Admin</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <BarChart3 size={32} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Financial Reports</h3>
              <p className="text-xs sm:text-sm text-gray-600">Revenue, assets, and transactions</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <FileText size={32} className="text-green-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Member Reports</h3>
              <p className="text-xs sm:text-sm text-gray-600">Member activity and statistics</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <Download size={32} className="text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Export Data</h3>
              <p className="text-xs sm:text-sm text-gray-600">CSV, PDF, or Excel formats</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Report</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
                <select 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="monthly">Monthly Financial Report</option>
                  <option value="quarterly">Quarterly Member Statistics</option>
                  <option value="annual">Annual Compliance Report</option>
                  <option value="member-activity">Member Activity Report</option>
                  <option value="investment">Investment Performance Report</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                  <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                  <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleExportReport} 
                  disabled={generating}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  {generating ? 'Generating...' : 'Export Report'}
                </button>
                <button 
                  onClick={() => { setReportType('monthly'); setFromDate('2025-01-01'); setToDate('2025-12-22'); toast('Form reset'); }}
                  className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="mt-8 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {['December 2025 Financial Report', 'Q4 2025 Member Statistics', 'Annual Compliance Check'].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{report}</p>
                      <p className="text-xs text-gray-500">Generated 2 days ago</p>
                    </div>
                  </div>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
