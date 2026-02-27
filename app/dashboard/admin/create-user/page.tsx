//home/hp/JERE/AutoNest/app/dashboard/admin/create-user/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { adminApi } from "@/app/lib/api-client";
import { UserPlus, User, Mail, Phone, ArrowLeft } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.email) return toast.error('Email is required');
    if (!form.firstName) return toast.error('First name is required');
    if (!form.lastName) return toast.error('Last name is required');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await adminApi.createUser({
        email: form.email,
        phone: form.phone || undefined,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        role: 'customer',
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to create user');
        setLoading(false);
        return;
      }

      toast.success('✅ User created successfully');
      toast.info(`📧 Temporary credentials sent to ${form.email}`);
      // navigate to customers listing so admin can verify the new user
      setTimeout(() => router.push('/dashboard/admin/customers'), 900);
    } catch (err) {
      console.error(err);
      toast.error('⚠️ Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
            <ArrowLeft size={18} /> Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <UserPlus size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Create User</h1>
              <p className="text-orange-100 mt-1">Create a user account and send temporary credentials via email.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-orange-600" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
