// File: /app/dashboard/admin/account-types/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountTypeApi, accountsApi } from "@/app/lib/api-client";
import {
  CreditCard,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Edit,
  Users,
  Wallet,
  Calendar,
  Info,
} from "lucide-react";
import { DashboardSectionLoader, MinimalSpinner } from "@/app/components/loaders";

interface AccountType {
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
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  userId: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  accountStatus: string;
  totalBalance: number;
  createdAt: string;
}

export default function AccountTypeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountTypeId = params?.id as string;

  const [user, setUser] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check user authentication and role
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

        if (!accountTypeId) {
          toast.error("Account Type ID missing");
          router.push("/dashboard/admin/account-types");
          return;
        }

        // Load account type details
        const response = await accountTypeApi.getById(accountTypeId);

        if (response.success && response.accountType) {
          setAccountType(response.accountType);
          
          // Load accounts using this account type
          loadAccountsForType();
        } else {
          toast.error("Account type not found");
          router.push("/dashboard/admin/account-types");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load account type");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountTypeId, router]);

  const loadAccountsForType = async () => {
    setLoadingAccounts(true);
    try {
      const response = await accountsApi.getAll();
      if (response.success && response.accounts) {
        // Filter accounts by this account type
        const filtered = response.accounts.filter(
          (acc: any) => acc.accountType?.id === accountTypeId
        );
        setAccounts(filtered);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/admin/account-types?edit=${accountTypeId}`);
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSectionLoader message="Loading account type details..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!accountType) {
    return (
      <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Account type not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.totalBalance, 0);
  const activeAccounts = accounts.filter((acc) => acc.accountStatus === "ACTIVE").length;

  return (
    <DashboardLayout userType="admin" firstName={user?.firstName} lastName={user?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/admin/account-types")}
            className="flex items-center gap-2 text-orange-600 hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back to Account Types
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{accountType.name}</h1>
          <p className="text-gray-600 mt-2">{accountType.description}</p>
        </div>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition font-semibold shadow-lg"
          >
            <Edit size={20} />
            Edit
          </button>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard size={32} />
              <h2 className="text-xl font-bold">Account Type Details</h2>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                accountType.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {accountType.active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-indigo-100 text-sm">Total Accounts</p>
              <p className="text-3xl font-bold">{accounts.length}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Active Accounts</p>
              <p className="text-3xl font-bold">{activeAccounts}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">KES {totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Account Type Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Interest Rate */}
          {accountType.interestRate !== undefined && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-600">Interest Rate</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{accountType.interestRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Annual percentage rate</p>
            </div>
          )}

          {/* Category */}
          {accountType.category && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Info size={24} className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-600">Category</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{accountType.category}</p>
              <p className="text-xs text-gray-500 mt-1">Account classification</p>
            </div>
          )}

          {/* Min Balance */}
          {accountType.minBalance !== undefined && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign size={24} className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-600">Minimum Balance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                KES {accountType.minBalance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Required minimum</p>
            </div>
          )}

          {/* Max Balance */}
          {accountType.maxBalance !== undefined && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Wallet size={24} className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-600">Maximum Balance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                KES {accountType.maxBalance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Balance limit</p>
            </div>
          )}

          {/* Lock-in Period */}
          {accountType.lockInPeriodMonths !== undefined && (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={24} className="text-red-600" />
                <span className="text-sm font-semibold text-gray-600">Lock-in Period</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {accountType.lockInPeriodMonths}
              </p>
              <p className="text-xs text-gray-500 mt-1">Months required</p>
            </div>
          )}

          {/* Created Date */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={24} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-600">Created</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {new Date(accountType.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(accountType.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            Features & Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {accountType.allowWithdrawals ? (
                <Unlock size={24} className="text-green-600" />
              ) : (
                <Lock size={24} className="text-red-600" />
              )}
              <div>
                <p className="font-semibold text-gray-900">Withdrawals</p>
                <p className="text-sm text-gray-600">
                  {accountType.allowWithdrawals ? "Allowed" : "Not Allowed"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {accountType.allowLoans ? (
                <CheckCircle size={24} className="text-green-600" />
              ) : (
                <XCircle size={24} className="text-red-600" />
              )}
              <div>
                <p className="font-semibold text-gray-900">Loans</p>
                <p className="text-sm text-gray-600">
                  {accountType.allowLoans ? "Allowed" : "Not Allowed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Using This Type */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Accounts Using This Type ({accounts.length})
          </h3>

          {loadingAccounts ? (
            <div className="flex items-center justify-center py-8">
              <MinimalSpinner />
              <p className="ml-3 text-gray-600">Loading accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">No accounts using this type yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["User", "Status", "Balance", "Created", "Actions"].map((h) => (
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
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {account.user?.firstName || ""} {account.user?.lastName || ""}
                          </p>
                          <p className="text-xs text-gray-600">{account.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            account.accountStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : account.accountStatus === "SUSPENDED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {account.accountStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        KES {account.totalBalance.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => router.push(`/dashboard/admin/accounts/${account.id}`)}
                          className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}