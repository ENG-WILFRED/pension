///home/hp/JERE/pension/app/dashboard/admin/account-types/page.tsx

"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { Layers, Search, Download, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { accountTypeApi } from '@/app/lib/api-client';

interface AccountType {
  id: string;
  name: string;
  description: string;
  category: string;
  minBalance?: number;
  maxBalance?: number;
  interestRate?: number;
  lockInPeriodMonths?: number;
  allowWithdrawals: boolean;
  allowLoans: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AccountTypesPage() {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadAccountTypes();
  }, []);

  const loadAccountTypes = async () => {
    try {
      setLoading(true);
      const res = await accountTypeApi.getAll();
      
      if (res.success && res.accountTypes) {
        setAccountTypes(res.accountTypes);
      } else {
        toast.error(res.error || 'Failed to load account types');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load account types');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await accountTypeApi.delete(id);
      
      if (res.success) {
        toast.success('Account type deleted');
        setAccountTypes(prev => prev.filter(at => at.id !== id));
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account type');
    }
  };

  const filteredAccountTypes = accountTypes.filter(at => {
    const matchesSearch = at.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         at.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || at.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MANDATORY: 'bg-blue-100 text-blue-800',
      VOLUNTARY: 'bg-green-100 text-green-800',
      EMPLOYER: 'bg-orange-100 text-orange-800',
      SAVINGS: 'bg-purple-100 text-purple-800',
      WITHDRAWAL: 'bg-red-100 text-red-800',
      BENEFITS: 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Types</h1>
              <p className="text-sm text-gray-600 mt-1">Manage pension account type configurations.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">
                ← Back to Admin
              </Link>
              <Link 
                href="/dashboard/admin/account-types/create"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                <Plus size={18} />
                Create Account Type
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search account types..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-full"
                />
              </div>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="MANDATORY">Mandatory</option>
                <option value="VOLUNTARY">Voluntary</option>
                <option value="EMPLOYER">Employer</option>
                <option value="SAVINGS">Savings</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="BENEFITS">Benefits</option>
              </select>
              <button 
                onClick={() => toast.info('Export feature coming soon')}
                className="flex items-center gap-2 justify-center bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 text-sm font-medium"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Account Types List */}
          {filteredAccountTypes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-12 text-center">
              <Layers size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Account Types Found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first account type.</p>
              <Link 
                href="/dashboard/admin/account-types/create"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
              >
                <Plus size={20} />
                Create Account Type
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccountTypes.map((accountType) => (
                <div 
                  key={accountType.id}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(accountType.category)}`}>
                      {accountType.category}
                    </span>
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/admin/account-types/${accountType.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="View"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </Link>
                      <Link 
                        href={`/dashboard/admin/account-types/${accountType.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} className="text-green-600" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(accountType.id, accountType.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{accountType.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{accountType.description}</p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    {accountType.interestRate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Interest Rate:</span>
                        <span className="font-semibold text-gray-900">{accountType.interestRate}%</span>
                      </div>
                    )}
                    {accountType.lockInPeriodMonths && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lock-in Period:</span>
                        <span className="font-semibold text-gray-900">{accountType.lockInPeriodMonths} months</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Withdrawals:</span>
                      <span className={`font-semibold ${accountType.allowWithdrawals ? 'text-green-600' : 'text-red-600'}`}>
                        {accountType.allowWithdrawals ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loans:</span>
                      <span className={`font-semibold ${accountType.allowLoans ? 'text-green-600' : 'text-red-600'}`}>
                        {accountType.allowLoans ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}