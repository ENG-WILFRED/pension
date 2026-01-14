///home/hp/JERE/AutoNest/app/dashboard/admin/accounts/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { accountsApi, userApi, accountTypeApi } from "@/app/lib/api-client";
import { Plus, Search, ArrowLeft, CheckCircle } from "lucide-react";
import { DashboardSectionLoader, ButtonLoader } from "@/app/components/loaders";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
}

interface AccountType {
  id: string;
  name: string;
  description: string;
  interestRate?: number;
  category?: string;
}

export default function AdminCreateAccountPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{firstName?: string; lastName?: string} | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    userId: "",
    accountTypeId: "",
    initialBalance: "0",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setCurrentUser(userData);

          if (userData.role !== 'admin') {
            toast.error('Access denied: Admin only');
            router.push('/dashboard/customer');
            return;
          }
        }

        const [usersRes, typesRes] = await Promise.all([
          userApi.getAll(),
          accountTypeApi.getAll(),
        ]);

        if (usersRes.success && usersRes.users) {
          // Filter only customers
          const customers = usersRes.users.filter((u: User) => u.role === 'customer');
          setUsers(customers);
        } else {
          toast.error('Failed to load users');
        }

        if (typesRes.success && typesRes.accountTypes) {
          setAccountTypes(typesRes.accountTypes);
        } else {
          toast.error('Failed to load account types');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.accountTypeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await accountsApi.create({
        userId: formData.userId,
        accountTypeId: formData.accountTypeId,
        initialBalance: parseFloat(formData.initialBalance) || 0,
      });

      if (response.success) {
        toast.success('✅ Account created successfully!');
        router.push('/dashboard/admin/accounts');
      } else {
        toast.error(response.error || 'Failed to create account');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout userType="admin" firstName={currentUser?.firstName} lastName={currentUser?.lastName}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSectionLoader message="Loading..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" firstName={currentUser?.firstName} lastName={currentUser?.lastName}>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/admin/accounts')}
            className="flex items-center gap-2 text-orange-600 hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back to Accounts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Details</h2>

              {/* User Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Customer *
                </label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  required
                  size={6}
                >
                  <option value="">-- Select a customer --</option>
                  {filteredUsers.length === 0 ? (
                    <option disabled>No customers found</option>
                  ) : (
                    filteredUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {users.length} customer{users.length !== 1 ? 's' : ''} available
                </p>
              </div>

              {/* Account Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type *
                </label>
                <select
                  value={formData.accountTypeId}
                  onChange={(e) => setFormData({ ...formData, accountTypeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">-- Select account type --</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                      {type.interestRate && ` (${type.interestRate}% interest)`}
                    </option>
                  ))}
                </select>
                {accountTypes.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No account types available. Please create account types first.
                  </p>
                )}
              </div>

              {/* Initial Balance */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Balance (KES) - Optional
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave as 0 for new accounts
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.userId || !formData.accountTypeId}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-4 rounded-xl hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                {submitting ? (
                  <>
                    <ButtonLoader />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Select a customer from the list</li>
                <li>Choose an account type</li>
                <li>Set initial balance (optional)</li>
                <li>Click "Create Account"</li>
                <li>Customer can now see their account</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle size={20} />
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Total Customers:</span>
                  <span className="font-bold text-green-900">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Account Types:</span>
                  <span className="font-bold text-green-900">{accountTypes.length}</span>
                </div>
              </div>
            </div>

            {accountTypes.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ No Account Types</h3>
                <p className="text-sm text-red-700 mb-4">
                  You need to create account types before creating accounts.
                </p>
                <button
                  onClick={() => router.push('/dashboard/admin/account-types/create')}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                >
                  Create Account Type
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}