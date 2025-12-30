"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';
import { userApi } from '@/app/lib/api-client';
import { 
  ArrowLeft, Mail, Phone, Calendar, MapPin, Briefcase, 
  User, CreditCard, Shield, Loader2 
} from 'lucide-react';
import Link from 'next/link';

interface UserDetail {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  employer?: string;
  nationalId?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  // 🔧 FIX: Unwrap params using React.use()
  const { id } = use(params);
  const router = useRouter();
  const [member, setMember] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await userApi.getById(id);
        if (response.success && response.user) {
          setMember(response.user);
        } else {
          toast.error('❌ User not found');
          console.error('API Error:', response.error);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const promoteToAdmin = async () => {
    if (!member) return;
    try {
      const res = await userApi.promoteToAdmin(member.id);
      if (res.success) {
        setMember({ ...member, role: 'admin' });
        toast.success('✅ User promoted to admin');
      } else {
        toast.error(res.error || 'Failed to promote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote user');
    }
  };

  const demoteToCustomer = async () => {
    if (!member) return;
    try {
      const res = await userApi.demoteToCustomer(member.id);
      if (res.success) {
        setMember({ ...member, role: 'customer' });
        toast.success('✅ User demoted to customer');
      } else {
        toast.error(res.error || 'Failed to demote user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to demote user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <User className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Link href="/dashboard/admin/manage" className="text-indigo-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/admin/manage" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4">
            <ArrowLeft size={20} />
            Back to Users
          </Link>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {member.firstName || member.lastName ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : 'User Details'}
                </h1>
                <p className="text-indigo-100 mt-1">{member.email}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                member.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {member.role || 'customer'}
              </div>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </p>
                <p className="font-medium text-gray-900">
                  {member.firstName || member.lastName ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </p>
                <p className="font-medium text-gray-900">{member.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </p>
                <p className="font-medium text-gray-900">{member.phone || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Birth
                </p>
                <p className="font-medium text-gray-900">
                  {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <User size={16} />
                  Gender
                </p>
                <p className="font-medium text-gray-900">{member.gender || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CreditCard size={16} />
                  National ID
                </p>
                <p className="font-medium text-gray-900">{member.nationalId || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Location & Employment */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-indigo-600" />
              Location & Employment
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </p>
                <p className="font-medium text-gray-900">{member.address || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin size={16} />
                  City
                </p>
                <p className="font-medium text-gray-900">{member.city || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin size={16} />
                  Country
                </p>
                <p className="font-medium text-gray-900">{member.country || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Briefcase size={16} />
                  Occupation
                </p>
                <p className="font-medium text-gray-900">{member.occupation || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Briefcase size={16} />
                  Employer
                </p>
                <p className="font-medium text-gray-900">{member.employer || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            Account Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium text-gray-900 font-mono text-sm">{member.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">{new Date(member.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">
                {member.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h2>
          
          <div className="flex flex-wrap gap-3">
            {member.role !== 'admin' ? (
              <button
                onClick={promoteToAdmin}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <Shield size={20} />
                Promote to Admin
              </button>
            ) : (
              <button
                onClick={demoteToCustomer}
                className="px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition flex items-center gap-2"
              >
                <User size={20} />
                Demote to Customer
              </button>
            )}
            
            <button
              onClick={() => toast.info('Edit functionality coming soon')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Edit User
            </button>
            
            <button
              onClick={() => toast.info('Message functionality coming soon')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}