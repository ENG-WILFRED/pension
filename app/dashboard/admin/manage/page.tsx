"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { Users, Search, Download, CheckCircle, RefreshCw } from 'lucide-react';
import { userApi } from '@/app/lib/api-client';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  createdAt: string;
  role?: string;
}

export default function AdminManageList() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'customer'>('all');

  // 🆕 Load users from API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll();
      if (response.success && response.users) {
        setMembers(response.users);
        toast.success(`✅ Loaded ${response.users.length} users`);
      } else {
        toast.error('⚠️ Failed to load users');
        console.error('API Error:', response.error);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredMembers = members.filter(m => {
    const name = `${m.firstName || ''} ${m.lastName || ''}`.trim().toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || 
                         m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || (m.role || 'customer') === filterRole;
    return matchesSearch && matchesRole;
  });

  const promoteUser = async (id: string) => {
    try {
      const res = await userApi.promoteToAdmin(id);
      if (res.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role: 'admin' } : m));
        toast.success('✅ User promoted to admin');
      } else {
        toast.error(res.error || 'Failed to promote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote user');
    }
  };

  const demoteUser = async (id: string) => {
    try {
      const res = await userApi.demoteToCustomer(id);
      if (res.success) {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role: 'customer' } : m));
        toast.success('✅ User demoted to customer');
      } else {
        toast.error(res.error || 'Failed to demote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to demote user');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage member accounts and permissions.</p>
            </div>
            <Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">← Back to Admin</Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-full"
                />
              </div>
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'customer')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="customer">Customers</option>
              </select>
              <button 
                onClick={loadUsers}
                disabled={loading}
                className="flex items-center gap-2 justify-center bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button className="flex items-center gap-2 justify-center bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 text-sm font-medium">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Members Table - Mobile Responsive */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-white/60">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="sm:w-6 sm:h-6 text-indigo-600" />
                Members ({filteredMembers.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="ml-4 text-gray-600">Loading users...</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">No users found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50/50 backdrop-blur-sm">
                    <tr>
                      {["Name", "Email", "Phone", "Join Date", "Role", "Action"].map((h) => (
                        <th
                          key={h}
                          className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white/60">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                          {m.firstName || m.lastName ? `${m.firstName || ''} ${m.lastName || ''}`.trim() : 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                          {m.email}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 hidden lg:table-cell">
                          {m.phone || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            (m.role || 'customer') === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {(m.role || 'customer') === 'admin' && <CheckCircle size={14} />}
                            {m.role || 'customer'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 flex gap-2">
                          <Link href={`/dashboard/admin/manage/${m.id}`} className="text-xs bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-indigo-700 whitespace-nowrap">
                            View
                          </Link>
                          {(m.role || 'customer') !== 'admin' ? (
                            <button
                              onClick={() => promoteUser(m.id)}
                              className="text-xs px-2 sm:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              onClick={() => demoteUser(m.id)}
                              className="text-xs px-2 sm:px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 whitespace-nowrap"
                            >
                              Demote
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}