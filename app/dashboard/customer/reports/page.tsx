///home/hp/JERE/AutoNest/app/dashboard/customer/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  FileText, Download, Trash2, RefreshCw, Plus, 
  Calendar, User, Receipt 
} from "lucide-react";
import { reportsApi, dashboardApi, userApi } from "@/app/lib/api-client";

interface Report {
  id: string;
  type: string;
  title: string;
  fileName: string;
  pdfBase64: string;
  metadata?: any;
  createdAt: string;
}

export default function CustomerReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await reportsApi.getAll();
      if (response.success && response.data) {
        setReports(response.data);
        toast.success(`📊 Loaded ${response.data.length} reports`);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (err) {
      console.error('Error loading reports:', err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMyReport = async () => {
    setGenerating(true);
    try {
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser?.id) {
        toast.error('User not found');
        return;
      }

      const [userResponse, transactionsResponse] = await Promise.all([
        userApi.getById(currentUser.id),
        dashboardApi.getTransactions(),
      ]);

      if (!userResponse.success || !userResponse.user) {
        toast.error('Failed to fetch user data');
        return;
      }

      const response = await reportsApi.generateCustomerReport({
        title: `My Account Report - ${new Date().toLocaleDateString()}`,
        user: {
          id: userResponse.user.id,
          email: userResponse.user.email,
          firstName: userResponse.user.firstName,
          lastName: userResponse.user.lastName,
        },
        transactions: transactionsResponse.success ? transactionsResponse.transactions : [],
      });

      if (response.success) {
        toast.success('✅ Report generated successfully');
        await loadReports();
      } else {
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      toast.info('📥 Downloading report...');
      reportsApi.downloadPDF(report.pdfBase64, report.fileName);
      toast.success('✅ Report downloaded successfully');
    } catch (err) {
      console.error('Error downloading report:', err);
      toast.error('Failed to download report');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await reportsApi.delete(reportId);
      if (response.success) {
        toast.success('✅ Report deleted successfully');
        setReports(reports.filter(r => r.id !== reportId));
      } else {
        toast.error(response.error || 'Failed to delete report');
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      toast.error('Failed to delete report');
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedUser = userStr ? JSON.parse(userStr) : null;

    if (!storedUser || storedUser.role === 'admin') {
      toast.error('Access denied');
      router.push('/dashboard/admin');
      return;
    }

    loadReports();
  }, [router]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600 mt-1">Download your account reports</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadReports}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleGenerateMyReport}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Generate My Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900">About Reports</h3>
            <p className="text-sm text-blue-700 mt-1">
              Generate comprehensive PDF reports containing your account details, transaction history, 
              and pension plan information. Reports are securely stored and can be downloaded anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600 mb-6">Generate your first report to get started</p>
          <button
            onClick={handleGenerateMyReport}
            disabled={generating}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate My Report'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {report.type === 'transaction' ? (
                    <Receipt className="text-blue-600" size={24} />
                  ) : (
                    <User className="text-green-600" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{report.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                {report.type === 'customer' ? 'Account & Transaction Report' : 'Transaction History'}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDownload(report)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}