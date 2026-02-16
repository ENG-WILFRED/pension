"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { accountsApi } from "@/app/lib/api-client";
import { CreditCard, DollarSign, TrendingUp, X, AlertCircle } from "lucide-react";
import { PageLoader, ButtonLoader } from "@/app/components/loaders";

interface Account {
  id: string;
  accountNumber?: string; 
  accountType: { name: string };
  totalBalance: number;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSuccess: () => void;
}

function DepositModal({ isOpen, onClose, account, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!phone || !phone.match(/^\+254\d{9}$/)) {
      toast.error('Please enter a valid phone number (+254XXXXXXXXX)');
      return;
    }

    setSubmitting(true);

    try {
      let accountIdentifier: string | undefined = account.accountNumber || account.id;

      if (!accountIdentifier) {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            if (Array.isArray(u.accounts) && u.accounts.length > 0) {
              accountIdentifier = u.accounts[0].accountNumber || u.accounts[0].id;
            } else if (u.accountNumber) {
              accountIdentifier = String(u.accountNumber);
            } else if (u.account && u.account.accountNumber) {
              accountIdentifier = u.account.accountNumber;
            }
          } catch (err) {
            console.warn('Failed to parse user from localStorage', err);
          }
        }
      }

      if (!accountIdentifier) {
        toast.error('No account number available for deposit');
        setSubmitting(false);
        return;
      }

      const payload = {
        amount: parseFloat(amount),
        phone,
        description: 'Deposit to pension account',
      } as const;

      const response = await accountsApi.deposit(accountIdentifier, payload);

      if (response.success) {
        toast.success('📱 M-Pesa STK Push initiated! Check your phone.');
        onClose();
        setAmount("");
        setPhone("");
        
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        toast.error(response.error || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <DollarSign className="text-green-600 dark:text-green-500" size={24} />
            M-Pesa Deposit
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Depositing to:</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{account.accountType.name}</p>
          {account.accountNumber && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Account: {account.accountNumber}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Current Balance: <span className="font-semibold text-orange-600 dark:text-orange-400">
              KES {(account.totalBalance ?? 0).toLocaleString()}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Amount (KES)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254712345678"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
              pattern="^\+254\d{9}$"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Format: +254XXXXXXXXX (e.g., +254712345678)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 dark:bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <ButtonLoader />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign size={20} />
                  Deposit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerContributionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeAmount: "",
    employerAmount: "",
    description: "",
  });

  const loadAccounts = async () => {
    try {
      const response = await accountsApi.getAll();
      
      if (response.success && response.accounts) {
        setAccounts(response.accounts);
        
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
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAccounts();
      setLoading(false);
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
        await loadAccounts();
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

  const handleDepositClick = () => {
    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }
    setDepositModalOpen(true);
  };

  if (loading) {
    return <PageLoader />;
  }

  // Contributions/deposits temporarily disabled — show placeholder
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contributions Temporarily Disabled</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The deposit and contribution features are temporarily disabled — they will return in a future release.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold">Back to Dashboard</button>
      </div>
    </div>
  );
}