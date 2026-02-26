///home/hp/JERE/pension/app/dashboard/admin/account-types/create/page.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { Save, X } from 'lucide-react';
import { accountTypeApi } from '@/app/lib/api-client';

export default function CreateAccountTypePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'MANDATORY',
    minBalance: '',
    maxBalance: '',
    interestRate: '',
    lockInPeriodMonths: '',
    allowWithdrawals: true,
    allowLoans: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        ...(formData.minBalance && { minBalance: parseFloat(formData.minBalance) }),
        ...(formData.maxBalance && { maxBalance: parseFloat(formData.maxBalance) }),
        ...(formData.interestRate && { interestRate: parseFloat(formData.interestRate) }),
        ...(formData.lockInPeriodMonths && { lockInPeriodMonths: parseInt(formData.lockInPeriodMonths) }),
        allowWithdrawals: formData.allowWithdrawals,
        allowLoans: formData.allowLoans,
      };

      const res = await accountTypeApi.create(payload);
      
      if (res.success) {
        toast.success('Account type created successfully!');
        router.push('/dashboard/admin/account-types');
      } else {
        toast.error(res.error || 'Failed to create account type');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create account type');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account Type</h1>
              <p className="text-sm text-gray-600 mt-1">Define a new pension account type configuration.</p>
            </div>
            <Link href="/dashboard/admin/account-types" className="text-sm text-orange-600 hover:underline">
              ← Back to Account Types
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Standard Mandatory Pension"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the account type..."
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="MANDATORY">Mandatory</option>
                  <option value="VOLUNTARY">Voluntary</option>
                  <option value="EMPLOYER">Employer</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                  <option value="BENEFITS">Benefits</option>
                </select>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Balance (KES)</label>
                  <input
                    type="number"
                    name="minBalance"
                    value={formData.minBalance}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Balance (KES)</label>
                  <input
                    type="number"
                    name="maxBalance"
                    value={formData.maxBalance}
                    onChange={handleChange}
                    placeholder="Unlimited"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lock-in Period (Months)</label>
                  <input
                    type="number"
                    name="lockInPeriodMonths"
                    value={formData.lockInPeriodMonths}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="allowWithdrawals"
                    name="allowWithdrawals"
                    checked={formData.allowWithdrawals}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <label htmlFor="allowWithdrawals" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Allow Withdrawals
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="allowLoans"
                    name="allowLoans"
                    checked={formData.allowLoans}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <label htmlFor="allowLoans" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Allow Loans Against This Account
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {loading ? 'Creating...' : 'Create Account Type'}
                </button>
                <Link
                  href="/dashboard/admin/account-types"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300"
                >
                  <X size={20} />
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}