// app/dashboard/admin/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "../../DashboardLayout";
import { 
  FileText, Download, Trash2, RefreshCw, Plus, 
  Calendar, User, Receipt, AlertCircle 
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

export default function AdminReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

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

  const handleGenerateTransactionReport = async () => {
    setGenerating(true);
    try {
      const transactionsResponse = await dashboardApi.getTransactions();
      if (!transactionsResponse.success || !transactionsResponse.transactions) {
        toast.error('Failed to fetch transactions');
        return;
      }

      const response = await reportsApi.generateTransactionReport({
        title: `Transaction Report - ${new Date().toLocaleDateString()}`,
        transactions: transactionsResponse.transactions.map((tx: any) => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          createdAt: tx.createdAt,
        })),
      });

      if (response.success) {
        toast.success('✅ Transaction report generated successfully');
        setShowGenerateModal(false);
        await loadReports();
      } else {
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate transaction report');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCustomerReport = async () => {
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
        title: `Customer Report - ${new Date().toLocaleDateString()}`,
        user: {
          id: userResponse.user.id,
          email: userResponse.user.email,
          firstName: userResponse.user.firstName,
          lastName: userResponse.user.lastName,
        },
        transactions: transactionsResponse.success ? transactionsResponse.transactions : [],
      });

      if (response.success) {
        toast.success('✅ Customer report generated successfully');
        setShowGenerateModal(false);
        await loadReports();
      } else {
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to generate customer report');
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

    if (!storedUser || storedUser.role !== 'admin') {
      toast.error('Access denied');
      router.push('/dashboard/customer');
      return;
    }

    setUser(storedUser);
    loadReports();
  }, [router]);

  if (loading && !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      userType="admin" 
      firstName={user?.firstName ?? 'Admin'} 
      lastName={user?.lastName ?? ''}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Generate and manage system reports</p>
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
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={16} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-6">Generate your first report to get started</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Generate Report
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
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

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

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h2>
              <p className="text-gray-600 mb-6">Choose the type of report to generate</p>

              <div className="space-y-3">
                <button
                  onClick={handleGenerateTransactionReport}
                  disabled={generating}
                  className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  <Receipt className="text-blue-600" size={24} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Transaction Report</p>
                    <p className="text-sm text-gray-600">All system transactions</p>
                  </div>
                </button>

                <button
                  onClick={handleGenerateCustomerReport}
                  disabled={generating}
                  className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition disabled:opacity-50"
                >
                  <User className="text-green-600" size={24} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Customer Report</p>
                    <p className="text-sm text-gray-600">Your account details</p>
                  </div>
                </button>
              </div>

              {generating && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-blue-900">Generating report...</p>
                </div>
              )}

              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}