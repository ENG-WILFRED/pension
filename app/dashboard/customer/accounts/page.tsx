"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { Wallet, X, ArrowUpCircle, ArrowDownCircle, TrendingUp, DollarSign } from "lucide-react";
import { PageLoader } from "@/app/components/loaders";

interface Account {
  id: string;
  accountType: {
    id?: string;
    name: string;
    description?: string;
    interestRate?: number;
  };
  accountStatus?: string;
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
  createdAt?: string;
}

export default function CustomerAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await accountsApi.getAll();
        if (res.success && res.accounts) {
          setAccounts(res.accounts);
        } else {
          console.warn('accountsApi.getAll failed', res.error);
          setError(res.error || 'Failed to load accounts');
          toast.warning('Could not load accounts');
          setAccounts([]);
        }
      } catch (err: any) {
        console.error('Error fetching accounts', err);
        setError(err?.message || 'Unknown error');
        toast.error('Error loading accounts');
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage or view your pension accounts</p>
          </div>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700"
            >
              <Wallet />
              View My Accounts
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <strong className="text-red-700 dark:text-red-300">Error:</strong>
            <span className="ml-2 text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Summary</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">You have <strong>{accounts.length}</strong> pension account(s).</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Click "View My Accounts" to open a modal with full details.</p>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-auto max-h-[80vh] z-10">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold">My Accounts</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {accounts.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>No accounts available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{account.accountType?.name || 'Pension Account'}</h4>
                            {account.accountType?.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">{account.accountType.description}</p>
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700">{account.accountStatus || 'UNKNOWN'}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <p className="text-xs">Total Balance</p>
                            <p className="text-lg font-bold">KES {Number(account.totalBalance ?? 0).toLocaleString()}</p>
                          </div>

                          <div className="p-3 rounded-lg bg-gradient-to-r from-green-400 to-yellow-400 text-white">
                            <p className="text-xs">Contributions</p>
                            <p className="text-lg font-bold">KES {Number((account.employeeBalance ?? 0) + (account.employerBalance ?? 0)).toLocaleString()}</p>
                          </div>

                          <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            <p className="text-xs">Investment Earnings</p>
                            <p className="text-lg font-bold">KES {Number(account.earningsBalance ?? 0).toLocaleString()}</p>
                          </div>

                          <div className="p-3 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white">
                            <p className="text-xs">Opened</p>
                            <p className="text-lg font-bold">{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : '—'}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 inline-flex items-center gap-2 justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg">
                            <ArrowUpCircle />
                            Contribute
                          </button>
                          <button className="flex-1 inline-flex items-center gap-2 justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-2 rounded-lg">
                            <ArrowDownCircle />
                            Withdraw
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
