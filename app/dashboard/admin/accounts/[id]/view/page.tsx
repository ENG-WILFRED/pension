// File: /app/dashboard/admin/accounts/[id]/view/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi } from "@/app/lib/api-client";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowLeft,
  User,
  Info,
  Activity,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Account {
  id: string;
  accountNumber?: string;
  userId: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  accountType: {
    id: string;
    name: string;
    description: string;
    interestRate?: number;
    category?: string;
    minBalance?: number;
    maxBalance?: number;
    lockInPeriodMonths?: number;
    allowWithdrawals?: boolean;
    allowLoans?: boolean;
  };
  accountStatus: string;
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  status: string;
  createdAt: string;
}

export default function AccountViewPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params?.id as string;

  const [user, setUser] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "user">("overview");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);

          if (userData.role !== "admin") {
            toast.error("Access denied: Admin only");
            router.push("/dashboard/customer");
            return;
          }
        }

        if (!accountId) {
          toast.error("Account ID missing");
          router.push("/dashboard/admin/accounts");
          return;
        }

        // Load account details
        const accountResponse = await accountsApi.getById(accountId);

        if (accountResponse.success && accountResponse.account) {
          setAccount(accountResponse.account);

          // Load account summary
          const summaryResponse = await accountsApi.getSummary(accountId);
          if (summaryResponse.success) {
            setSummary(summaryResponse);
          }
        } else {
          toast.error("Account not found");
          router.push("/dashboard/admin/accounts");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load account");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountId, router]);

  if (loading) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="ml-4 text-gray-600 font-medium">Loading account details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Account not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    if (status === "ACTIVE") return <CheckCircle size={20} className="text-green-600" />;
    if (status === "SUSPENDED") return <XCircle size={20} className="text-red-600" />;
    return <Clock size={20} className="text-gray-600" />;
  };

  return (
    <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/admin/accounts")}
            className="flex items-center gap-2 text-indigo-600 hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back to Accounts
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Details</h1>
              <p className="text-gray-600 mt-2">
                {account.user?.firstName} {account.user?.lastName} - {account.accountType.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/dashboard/admin/accounts/${account.id}/bank-details`)}
                className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Bank Details
              </button>
              <button
                onClick={() => router.push(`/dashboard/admin/accounts/${account.id}`)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg"
              >
                Manage Account
              </button>
            </div>
          </div>
        </div>

        {/* Account Summary Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet size={32} />
              <div>
                <h2 className="text-xl font-bold">Total Balance</h2>
                {account.accountNumber && (
                  <p className="text-indigo-100 text-sm">Account #{account.accountNumber}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(account.accountStatus)}
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  account.accountStatus
                )}`}
              >
                {account.accountStatus}
              </span>
            </div>
          </div>
          <p className="text-4xl sm:text-5xl font-bold mb-4">
            KES {account.totalBalance.toLocaleString()}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-indigo-400">
            <div>
              <p className="text-indigo-100 text-sm">Employee Contribution</p>
              <p className="text-2xl font-bold">KES {account.employeeBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Employer Contribution</p>
              <p className="text-2xl font-bold">KES {account.employerBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Earnings</p>
              <p className="text-2xl font-bold">KES {account.earningsBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === "overview"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Info size={18} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === "transactions"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Activity size={18} />
                Transactions
              </div>
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                activeTab === "user"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={18} />
                User Details
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Account Type Details */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-indigo-600" />
                Account Type Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {account.accountType.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {account.accountType.category || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Interest Rate</label>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    {account.accountType.interestRate || 0}%
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Lock-in Period</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {account.accountType.lockInPeriodMonths || 0} months
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-gray-700 mt-1">{account.accountType.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {account.accountType.allowWithdrawals ? (
                    <CheckCircle size={24} className="text-green-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">Withdrawals</p>
                    <p className="text-sm text-gray-600">
                      {account.accountType.allowWithdrawals ? "Allowed" : "Not Allowed"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {account.accountType.allowLoans ? (
                    <CheckCircle size={24} className="text-green-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">Loans</p>
                    <p className="text-sm text-gray-600">
                      {account.accountType.allowLoans ? "Allowed" : "Not Allowed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Metadata */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Account Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created At</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(account.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {new Date(account.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(account.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600" />
              Recent Transactions
            </h3>
            {summary?.transactions && summary.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Type", "Amount", "Description", "Status", "Date"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {summary.transactions.map((txn: Transaction) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {txn.type}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-900">
                          KES {txn.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {txn.description || "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              txn.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : txn.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600">No transactions found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "user" && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              User Information
            </h3>
            {account.user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {account.user.firstName} {account.user.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">{account.user.email}</p>
                </div>
                {account.user.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{account.user.phone}</p>
                  </div>
                )}
                {account.user.dateOfBirth && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {new Date(account.user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {account.user.gender && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{account.user.gender}</p>
                  </div>
                )}
                {account.user.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Address</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {account.user.address}
                      {account.user.city && `, ${account.user.city}`}
                      {account.user.country && `, ${account.user.country}`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">User information not available</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}