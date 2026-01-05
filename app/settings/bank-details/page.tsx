"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import UpdateBankDetailsForm from "@/app/components/settings/UpdateBankDetailsForm";
import { userApi } from "@/app/lib/api-client";

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
  bankAccount?: BankAccount;
  role?: string;
}

export default function BankDetailsSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const storedUser = userStr ? JSON.parse(userStr) : null;

        if (!storedUser?.id) {
          toast.error('Please log in to access settings');
          router.push('/login');
          return;
        }

        // Fetch fresh user data
        const userResponse = await userApi.getById(storedUser.id);
        
        if (userResponse.success && userResponse.user) {
          setUser(userResponse.user);
        } else {
          setUser(storedUser);
          toast.warning('Using cached user data');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleSuccess = async () => {
    // Refresh user data after successful update
    try {
      if (user?.id) {
        const userResponse = await userApi.getById(user.id);
        if (userResponse.success && userResponse.user) {
          setUser(userResponse.user);
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(userResponse.user));
        }
      }
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard/customer');
      }, 1500);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">User not found</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-indigo-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bank Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your bank account information for receiving pension payments
          </p>
        </div>

        {/* Bank Details Form */}
        <UpdateBankDetailsForm
          userId={user.id}
          currentBankDetails={user.bankAccount}
          onSuccess={handleSuccess}
        />

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Important Information
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Ensure your bank account details are accurate</li>
            <li>• This account will be used for pension withdrawals and payments</li>
            <li>• Changes may take 24-48 hours to reflect in the system</li>
            <li>• Contact support if you need to change verified details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}