"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi } from "@/app/lib/api-client";
import { CreditCard, DollarSign, Loader2, TrendingUp, Calendar } from "lucide-react";

interface Account {
  id: string;
  accountType: { name: string };
  totalBalance: number;
}

interface Contribution {
  id: string;
  employeeAmount: number;
  employerAmount: number;
  description?: string;
  createdAt: string;
}

export default function CustomerContributionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeAmount: "",
    employerAmount: "",
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        const response = await accountsApi.getAll();
        
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          
          // Pre-select account from URL if provided
          const accountParam = searchParams?.get('account');
          if (accountParam) {
            setSelectedAccountId(accountParam);
          } else if (response.accounts.length > 0) {
            setSelectedAccountId(response.accounts[0].id);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }

    if (!formData.employeeAmount && !formData.employerAmount) {
      toast.error('Please enter at least one contribution amount');
      return;
    }

    setSubmitting(true);

    try {
      const response = await accountsApi.addContribution(selectedAccountId, {
        employeeAmount: parseFloat(formData.employeeAmount) || 0,
        employerAmount: parseFloat(formData.employerAmount) || 0,
        description: formData.description || 'Regular contribution',
      });

      if (response.success) {
        toast.success('✅ Contribution added successfully!');
        setFormData({ employeeAmount: "", employerAmount: "", description: "" });
        
        // Refresh accounts
        const refreshResponse = await accountsApi.getAll();
        if (refreshResponse.success) {
          setAccounts(refreshResponse.accounts);
        }
      } else {
        toast.error(response.error || 'Failed to add contribution');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }

    const amount = prompt('Enter deposit amount (KES):');
    if (!amount) return;

    const phone = prompt('Enter M-Pesa phone number (+254XXXXXXXXX):');
    if (!phone) return;

    try {
      const response = await accountsApi.deposit(selectedAccountId, {
        amount: parseFloat(amount),
        phone,
        description: 'M-Pesa deposit',
      });

      if (response.success) {
        toast.success('📱 M-Pesa STK Push initiated! Check your phone.');
      } else {
        toast.error(response.error || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="customer" firstName={user?.firstName} lastName={user?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <DashboardLayout userType="customer" firstName={user?.firstName} lastName={user?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Make Contributions</h1>
          <p className="text-gray-600 mt-2">Add contributions to your pension account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contribution Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={24} />
                Contribution Details
              </h2>

              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No pension accounts available. Contact your administrator.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Account
                    </label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountType.name} - KES {account.totalBalance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Employee Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Employee Contribution (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.employeeAmount}
                      onChange={(e) => setFormData({ ...formData, employeeAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Employer Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Employer Contribution (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.employerAmount}
                      onChange={(e) => setFormData({ ...formData, employerAmount: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Monthly contribution for December"
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Total */}
                  {(formData.employeeAmount || formData.employerAmount) && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-indigo-900">Total Contribution:</span>
                        <span className="text-2xl font-bold text-indigo-900">
                          KES {((parseFloat(formData.employeeAmount) || 0) + (parseFloat(formData.employerAmount) || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || (!formData.employeeAmount && !formData.employerAmount)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Add Contribution
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Actions & Info */}
          <div className="space-y-6">
            {/* M-Pesa Deposit */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                M-Pesa Deposit
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Make a quick deposit using M-Pesa STK Push
              </p>
              <button
                onClick={handleDeposit}
                disabled={!selectedAccountId}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                Deposit via M-Pesa
              </button>
            </div>

            {/* Account Summary */}
            {selectedAccount && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Selected Account</h3>
                <p className="text-sm opacity-90 mb-4">{selectedAccount.accountType.name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-sm">Current Balance</span>
                </div>
                <p className="text-3xl font-bold">KES {selectedAccount.totalBalance.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}