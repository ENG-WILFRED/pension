///app/dashboard/admin/create-admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { adminApi } from "@/app/lib/api-client";
import { UserPlus, Mail, Phone, User, Lock, Calendar, IdCard, ArrowLeft, Loader2 } from "lucide-react";
import { ButtonLoader, DashboardSectionLoader } from "@/app/components/loaders";

interface CreateAdminFormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
}

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAdminFormData>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAdminFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateAdminFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAdminFormData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+254[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Kenyan phone number format (+254...)';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('⚠️ Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const response = await adminApi.createAdmin({
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
      });

      if (response.success) {
        toast.success('✅ Admin user created successfully!');
        toast.info(`📧 Temporary credentials sent to ${formData.email}`);
        setTimeout(() => {
          router.push('/dashboard/admin/manage');
        }, 1500);
      } else {
        const errorMsg = response.error || 'Failed to create admin user';
        if (errorMsg.toLowerCase().includes('exists') || errorMsg.toLowerCase().includes('already')) {
          toast.error('❌ This email or phone number is already registered');
        } else {
          toast.error(`❌ ${errorMsg}`);
        }
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      toast.error('⚠️ An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium mb-4 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Admin Dashboard
          </Link>

          <div className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 text-white rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 dark:bg-white/10 rounded-xl">
                <UserPlus size={32} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Create Admin User</h1>
                <p className="text-orange-100 dark:text-orange-200 mt-1">Add a new administrator to the system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6 transition-colors duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <UserPlus size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-200 transition-colors duration-300">Admin Account Creation</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1 transition-colors duration-300">
                This will create a new admin account with full system access. The system will automatically generate a temporary password and send it to the admin's email and phone.
              </p>
              <ul className="text-xs text-orange-600 dark:text-orange-400 mt-2 space-y-1 list-disc list-inside transition-colors duration-300">
                <li>No payment required for admin accounts</li>
                <li>Automatically assigned 'admin' role</li>
                <li>Account activated immediately</li>
                <li>Temporary password sent via email & SMS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 transition-colors duration-300">
          
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
              <User size={20} className="text-orange-600 dark:text-orange-400" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 ${errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 ${errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
              <Mail size={20} className="text-orange-600 dark:text-orange-400" />
              Contact Information
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300`}
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300`}
                    placeholder="+254712345678"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Kenyan number format: +254712345678</p>
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
              <IdCard size={20} className="text-orange-600 dark:text-orange-400" />
              Additional Information (Optional)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                  placeholder="123 Main Street"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                  placeholder="Nairobi"
                />
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300"
                  placeholder="Kenya"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Admin...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Admin User
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 transition-colors duration-300">
          <div className="flex items-start gap-3">
            <Lock size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm transition-colors duration-300">Security Notice</h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 transition-colors duration-300">
                The system will automatically generate a secure temporary password and send it to the admin's email and phone. The admin will be required to change this password on their first login. Admin users have full system access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}