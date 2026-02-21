"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageLoader } from "@/app/components/loaders";
import UserProfile from "@/app/components/dashboard/UserProfile";
import BalanceCards from "@/app/components/dashboard/BalanceCards";
import OverviewCard from "@/app/components/dashboard/OverviewCard";
import UpdateBankDetailsForm from '@/app/components/settings/UpdateBankDetailsForm';
import PensionPlans from "@/app/components/dashboard/PensionPlans";
import TransactionHistory from "@/app/components/dashboard/TransactionHistory";
import QuickActions from "@/app/components/dashboard/QuickActions";
import CustomerSettings from '@/app/dashboard/customer/settings/page';
import { userApi, dashboardApi, accountsApi } from "@/app/lib/api-client";

interface BankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  employer?: string;
  occupation?: string;
  salary?: string | number;
  contributionRate?: string | number;
  retirementAge?: number;
  dateOfBirth?: string;
  numberOfChildren?: number;
  address?: any;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
  kra?: string;
  nssfNumber?: string;
  role?: 'customer' | 'admin';
  bankDetails?: any[];
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string | null;
  createdAt: any;
}

interface PensionPlan {
  id: string;
  name: string;
  provider: string;
  contribution: number;
  expectedReturn: number;
  riskLevel: string;
  balance: number;
  status: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [pensionPlans, setPensionPlans] = useState<PensionPlan[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [projectedRetirement, setProjectedRetirement] = useState(0);
  // Overview metrics
  const [weekContribution, setWeekContribution] = useState(0);
  const [weekInterest, setWeekInterest] = useState(0);
  const [ytdContribution, setYtdContribution] = useState(0);
  const [ytdInterest, setYtdInterest] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Helper function to extract bank details from user object
  const getBankDetails = (user: User | null): BankAccount | undefined => {
    if (!user) return undefined;
    // Prefer nested bankDetails array if present (API returns array)
    if (Array.isArray(user.bankDetails) && user.bankDetails.length > 0) {
      const bd: any = user.bankDetails[0];
      return {
        bankName: bd.bankName || bd.bank || bd.bank_name,
        accountNumber: bd.accountNumber || bd.account_number || bd.account || bd.accountNo,
        accountName: bd.bankAccountName || bd.accountName || bd.account_name || bd.accountHolder,
        branchCode: bd.branchCode || bd.branch_code,
        branchName: bd.branchName || bd.branch_name,
      };
    }

    // Fallback to direct fields on user object
    const hasDirectDetails = user.bankName || user.accountNumber || user.accountName;
    if (hasDirectDetails) {
      return {
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        branchCode: user.branchCode,
        branchName: user.branchName,
      };
    }

    return undefined;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          router.push('/login');
          return;
        }

        if (storedUser.role === 'admin') {
          toast.error('🚫 Admins cannot access customer dashboard');
          router.push('/dashboard/admin');
          return;
        }

            // Fetch fresh user data from backend
        const userResponse = await userApi.getById(storedUser.id);
        console.log('[Dashboard] User API response:', userResponse);
        
        if (userResponse.success && userResponse.user) {
          if (userResponse.user.role === 'admin') {
            toast.error('Admins cannot access customer dashboard');
            router.push('/dashboard/admin');
            return;
          }
          
          // Update state with fresh data
          const enrichedUser = { ...userResponse.user };
          setUser(enrichedUser);
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(enrichedUser));
          console.log('[Dashboard] User data:', enrichedUser);
          
          // Fetch user's accounts to get account ID for bank details
          try {
            // First check if we have a stored account ID from registration
            let accountId: string | null = null;
            let accountNumber: string | null = null;
            const storedAccount = typeof window !== 'undefined' ? localStorage.getItem('account') : null;
            
            if (storedAccount) {
              const parsedAccount = JSON.parse(storedAccount);
              accountId = parsedAccount.id || parsedAccount.accountNumber;
              accountNumber = parsedAccount.accountNumber || parsedAccount.id;
              console.log('[Dashboard] Using stored account from registration:', accountId);
            }
            
            // If no stored account, fetch accounts from API
            if (!accountId) {
              const accountsResponse = await accountsApi.getAll();
              console.log('[Dashboard] Accounts API response:', accountsResponse);
              
              if (accountsResponse.success && accountsResponse.accounts && accountsResponse.accounts.length > 0) {
                const firstAccount = accountsResponse.accounts[0];
                accountId = firstAccount.id || firstAccount.accountNumber;
                accountNumber = firstAccount.accountNumber || firstAccount.id;
                console.log('[Dashboard] First account from API:', firstAccount);
                console.log('[Dashboard] Account ID being used:', accountId);
              } else {
                console.warn('[Dashboard] No accounts found for user', accountsResponse);
                toast.info('💳 No accounts found. Please complete your account setup.');
                accountId = null;
              }
            }
            
            // Add accountNumber to user object for UserProfile display
            if (accountNumber) {
              enrichedUser.accountNumber = accountNumber;
              setUser(enrichedUser);
              localStorage.setItem('user', JSON.stringify(enrichedUser));
            }
            
            // Fetch bank details if we have an account ID.
            // Try the likely `id` first; if backend returns 404, retry using `accountNumber`.
            if (accountId) {
              let bankDetailsResponse = await accountsApi.getBankDetails(String(accountId));
              console.log('[Dashboard] Bank details response (first attempt):', bankDetailsResponse);

              // If not found and we have a different accountNumber, try that as a fallback
              const maybeAccountNumber = (() => {
                try {
                  // If we fetched accountsResponse earlier, get the first account object
                  if (typeof window !== 'undefined') {
                    const sa = localStorage.getItem('account');
                    if (sa) {
                      const parsed = JSON.parse(sa);
                      return parsed.accountNumber || parsed.account_number || null;
                    }
                  }
                } catch (e) {
                  // ignore
                }
                return null;
              })();

              if (!bankDetailsResponse.success && bankDetailsResponse.error && bankDetailsResponse.error.toString().includes('404')) {
                // attempt fallback with account number if different
                if (maybeAccountNumber && String(maybeAccountNumber) !== String(accountId)) {
                  console.log('[Dashboard] Primary bank-details lookup returned 404; retrying with accountNumber:', maybeAccountNumber);
                  bankDetailsResponse = await accountsApi.getBankDetails(String(maybeAccountNumber));
                  console.log('[Dashboard] Bank details response (fallback):', bankDetailsResponse);
                }
              }

              if (bankDetailsResponse.success && bankDetailsResponse.bankDetails) {
                console.log('[Dashboard] Bank details found:', bankDetailsResponse.bankDetails);
                toast.success(`Welcome back, ${userResponse.user.firstName || storedUser.firstName}!`);
              } else if (!bankDetailsResponse.success && bankDetailsResponse.error && bankDetailsResponse.error.toString().includes('404')) {
                console.log('[Dashboard] No bank details found (404) - user needs to add them');
                toast.info('💳 Please update your bank details in settings');
                // Open the bank details modal so user can add details immediately
                try {
                  setBankModalOpen(true);
                } catch (e) {
                  console.warn('[Dashboard] Failed to open bank modal automatically', e);
                }
              } else if (!bankDetailsResponse.success) {
                console.error('[Dashboard] Error fetching bank details:', bankDetailsResponse.error || bankDetailsResponse);
              } else {
                console.log('[Dashboard] Bank details response was empty or unexpected:', bankDetailsResponse);
                toast.info('💳 Please update your bank details in settings');
              }
            } else {
              console.warn('[Dashboard] Could not determine account ID');
              toast.warning('⚠️ Could not load account details');
            }
          } catch (err) {
            console.error('[Dashboard] Error fetching accounts or bank details:', err);
          }
        } else {
          // Fallback to cached data
          console.warn('[Dashboard] User API failed, using cached data:', userResponse);
          setUser(storedUser);
          toast.warning('Using cached profile data');
        }

        // Pre-fill phone if available in user profile for deposit/other forms
        // (no-op here, kept for future enhancements)

        setLoadingTransactions(true);
        const transactionsResponse = await dashboardApi.getTransactions();
        
        if (transactionsResponse.success && transactionsResponse.transactions) {
          setTransactions(transactionsResponse.transactions);
        } else {
          console.warn('Failed to load transactions:', transactionsResponse.error);
          toast.warning('⚠️ Could not load transactions. Using sample data.');
          setTransactions([
            {
              id: "1",
              amount: 15000,
              type: "debit",
              status: "completed",
              description: "Monthly Contribution",
              createdAt: new Date(),
            },
          ]);
        }

        // Calculate overview metrics
        // Week: last 7 days, YTD: since Jan 1
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        let weekContrib = 0, weekInt = 0, ytdContrib = 0, ytdInt = 0;
        transactionsResponse.transactions?.forEach((tx: Transaction) => {
          const txDate = new Date(tx.createdAt);
          if (tx.type === 'debit' && tx.status === 'completed') {
            if (txDate >= startOfWeek) weekContrib += tx.amount;
            if (txDate >= startOfYear) ytdContrib += tx.amount;
          }
          // For demo: treat 'interest' in description as interest
          if (tx.description?.toLowerCase().includes('interest')) {
            if (txDate >= startOfWeek) weekInt += tx.amount;
            if (txDate >= startOfYear) ytdInt += tx.amount;
          }
        });
        setWeekContribution(weekContrib);
        setWeekInterest(weekInt);
        setYtdContribution(ytdContrib);
        setYtdInterest(ytdInt);
        setLoadingTransactions(false);

        // Use backend accounts to compute totals. Fall back to mock plans if accounts aren't available.
        try {
          const accountsRes = await accountsApi.getAll();
          if (accountsRes.success && Array.isArray(accountsRes.accounts) && accountsRes.accounts.length > 0) {
            // compute totals from normalized accounts
            const totalBal = accountsRes.accounts.reduce((sum: number, a: any) => sum + Number(a.totalBalance ?? 0), 0);
            const totalEmp = accountsRes.accounts.reduce((sum: number, a: any) => sum + Number(a.employeeBalance ?? 0), 0);
            const totalEr = accountsRes.accounts.reduce((sum: number, a: any) => sum + Number(a.employerBalance ?? 0), 0);
            const totalEarn = accountsRes.accounts.reduce((sum: number, a: any) => sum + Number(a.earningsBalance ?? 0), 0);

            const totalContribs = totalEmp + totalEr;

            // Map accounts into simple pension plan view if desired (lightweight)
            const mappedPlans: PensionPlan[] = accountsRes.accounts.map((a: any, idx: number) => ({
              id: String(a.id || idx),
              name: a.accountType?.name || a.accountNumber || `Account ${a.id}`,
              provider: 'AutoNest',
              contribution: Number(a.employeeBalance ?? 0) + Number(a.employerBalance ?? 0),
              expectedReturn: 8.0,
              riskLevel: 'Medium',
              balance: Number(a.totalBalance ?? 0),
              status: a.accountStatus || 'ACTIVE',
            }));

            setPensionPlans(mappedPlans);
            setTotalContributions(totalContribs);
            setBalance(totalBal);
            
            // Calculate years to retirement (assuming retirement at 60)
            const userDateOfBirth = userResponse.user?.dateOfBirth;
            const retirementAge = userResponse.user?.retirementAge || 60;
            let yearsToRetirement = 30; 
            if (userDateOfBirth) {
              const birthDate = new Date(userDateOfBirth);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              yearsToRetirement = Math.max(0, retirementAge - age);
            }
            
            // Projected = Years to retirement * 100 KES daily savings * 365 days
            // (i.e. KES 100 per day over remaining years)
            setProjectedRetirement(yearsToRetirement * 100 * 365);
          } else {
            // keep previous mock behaviour if no accounts
            setPensionPlans([]);
            setTotalContributions(0);
            setBalance(0);
            setProjectedRetirement(0);
          }
        } catch (e) {
          console.error('[Dashboard] Failed to compute totals from accounts:', e);
          setPensionPlans([]);
          setTotalContributions(0);
          setBalance(0);
          setProjectedRetirement(0);
        }

      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  if (loading) {
    return <PageLoader />;
  }

  // Get bank details using helper function
  const bankDetails = getBankDetails(user);

  const handleOpenBankModal = () => setBankModalOpen(true);
  const handleCloseBankModal = () => setBankModalOpen(false);

  const handleBankUpdateSuccess = async () => {
    // refresh user from API after update
    try {
      const userStr = localStorage.getItem('user');
      const storedUser = userStr ? JSON.parse(userStr) : null;
      if (!storedUser?.id) return;
      const userResponse = await userApi.getById(storedUser.id);
      if (userResponse.success && userResponse.user) {
        setUser(userResponse.user);
        localStorage.setItem('user', JSON.stringify(userResponse.user));
        toast.success('Bank details updated');
      }
    } catch (err) {
      console.warn('Failed to refresh user after bank update', err);
    } finally {
      handleCloseBankModal();
    }
  };

  const handleOpenSettings = () => setSettingsModalOpen(true);
  const handleCloseSettings = () => setSettingsModalOpen(false);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <UserProfile user={user} onOpenSettings={handleOpenSettings} />
      
      <OverviewCard
        weekContribution={weekContribution}
        weekInterest={weekInterest}
        ytdContribution={ytdContribution}
        ytdInterest={ytdInterest}
      />
      <BalanceCards 
        balance={balance} 
        totalContributions={totalContributions} 
        projectedRetirement={projectedRetirement}
        user={user ? {
          salary: user.salary,
          contributionRate: user.contributionRate,
          dateOfBirth: user.dateOfBirth,
          retirementAge: user.retirementAge,
        } : undefined}
      />
      
      <PensionPlans plans={pensionPlans} />
      
      {loadingTransactions ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-12 flex flex-col items-center justify-center transition-colors duration-300">
          <div className="h-10 w-10 border-4 border-orange-600 dark:border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading transactions...</p>
        </div>
      ) : (
        <TransactionHistory transactions={transactions} contributionRate={user?.contributionRate ? Number(user.contributionRate) : undefined} />
      )}
      
      <QuickActions userType="customer" />
    </div>

    {/* Bank details edit modal */}
    {bankModalOpen && user && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Bank Details</h3>
            <button 
              onClick={handleCloseBankModal} 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <UpdateBankDetailsForm
            userId={user.id}
            currentBankDetails={bankDetails}
            onSuccess={handleBankUpdateSuccess}
          />
        </div>
      </div>
    )}

    {/* Settings modal - with improved close functionality */}
    {settingsModalOpen && (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full my-8 transition-colors duration-300">
          {/* Sticky header with close button */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl z-10 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
            <button 
              onClick={handleCloseSettings} 
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>
          
          {/* Settings content - scrollable */}
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
            <CustomerSettings />
          </div>
          
          {/* Optional: Footer with close button for easier access */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-2xl z-10">
            <button
              onClick={handleCloseSettings}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}