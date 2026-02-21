"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { Wallet, TrendingUp, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { PageLoader } from "@/app/components/loaders";
import PensionDetails from '@/app/components/dashboard/EmploymentDetails';
import PensionPlans from '@/app/components/dashboard/PensionPlans';
import QuickActions from '@/app/components/dashboard/QuickActions';

interface Account {
  id: string;
  accountType: {
    id: string;
    name: string;
    description: string;
    interestRate?: number;
  };
  accountStatus: string;
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
  createdAt: string;
}

export default function CustomerPensionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [pensionPlans, setPensionPlans] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          // Map accounts to PensionPlans format for compatibility
          const mappedPlans = response.accounts.map((a: any, idx: number) => ({
            id: String(a.id || idx),
            name: a.accountType?.name || a.accountNumber || `Account ${a.id}`,
            provider: 'AutoNest',
            contribution: Number(a.employeeBalance ?? 0) + Number(a.employerBalance ?? 0),
            expectedReturn: a.accountType?.interestRate ?? 8.0,
            riskLevel: 'Medium',
            balance: Number(a.totalBalance ?? 0),
            status: a.accountStatus || 'ACTIVE',
          }));
          setPensionPlans(mappedPlans);
          const total = response.accounts.reduce((sum: number, acc: Account) => sum + Number(acc.totalBalance ?? 0), 0);
          setTotalBalance(total);
          toast.success(`Loaded ${response.accounts.length} pension account(s)`);
        } else {
          console.warn('Failed to load accounts:', response.error);
          toast.warning('⚠️ Could not load accounts from API');
          setAccounts([]);
        }
      } catch (err) {
        console.error('Error loading accounts:', err);
        toast.error('Failed to load pension accounts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      INACTIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400',
      SUSPENDED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8">
      {/* Pension Details Card */}
      {accounts.length > 0 && (
        <div className="mb-8">
          <PensionDetails
            accountNumber={accounts[0].id}
            contributionRate={accounts[0].accountType.interestRate}
            retirementAge={60}
          />
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Pension Plans</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your pension accounts</p>
      </div>

      {/* Total Balance Card - Matching Dashboard Style */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Wallet size={28} />
          </div>
          <h2 className="text-xl font-bold">Total Balance</h2>
        </div>
        <p className="text-4xl sm:text-5xl font-bold mb-2">KES {Number(totalBalance ?? 0).toLocaleString()}</p>
        <p className="text-white/90 mt-2">Across all plans</p>
      </div>

      {/* Pension Plans (moved from Dashboard) */}
      <PensionPlans plans={pensionPlans} />

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
          <Wallet size={64} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Pension Accounts Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Contact your employer or administrator to set up your pension account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{account.accountType.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{account.accountType.description}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-2">AutoNest ID:{String(account.id).padStart(8, '0')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(account.accountStatus)}`}>
                  {account.accountStatus}
                </span>
              </div>

              {/* Balance Breakdown - Matching Dashboard Gradient Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold opacity-90 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold">
                    {Number(account.totalBalance ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs opacity-80 mt-1">Across all plans</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <ArrowDownCircle size={18} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold opacity-90 mb-1">Contributions</p>
                    <p className="text-2xl font-bold">
                      {Number((account.employeeBalance ?? 0) + (account.employerBalance ?? 0)).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-80 mt-1">Total contributions</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold opacity-90 mb-1">Investment Earnings</p>
                    <p className="text-2xl font-bold">
                      {Number(account.earningsBalance ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-80 mt-1">Realised returns</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <p className="text-xs font-semibold opacity-90 mb-1">Years to Retirement</p>
                  <p className="text-2xl font-bold">
                      {Number(account.totalBalance ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-80 mt-1">Total balance</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {account.accountType.interestRate && (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-500 dark:text-orange-400" />
                    <span>Interest Rate: <strong className="text-gray-900 dark:text-gray-100">{account.accountType.interestRate}%</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-orange-500 dark:text-orange-400" />
                  <span>Opened: <strong className="text-gray-900 dark:text-gray-100">{new Date(account.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>
              {/* Actions */}
              {/* COMMENTED OUT: Make Contribution and Withdraw buttons - to be uncommented later */}
              {/* <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/dashboard/customer/contributions?account=${account.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-semibold shadow-lg"
                >
                  <ArrowUpCircle size={20} />
                  Make Contribution
                </button>
                <button
                  onClick={() => toast.info('Withdrawal feature coming soon')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
                >
                  <ArrowDownCircle size={20} />
                  Withdraw
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions (moved from Dashboard) */}
      <QuickActions userType="customer" />
    </div>
  );
}