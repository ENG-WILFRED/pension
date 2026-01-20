'use client';

import { Mail, Phone } from 'lucide-react';

interface AccountCredentialsSectionProps {
  formData: { email: string; phone: string };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AccountCredentialsSection({ formData, errors, onChange }: AccountCredentialsSectionProps) {
  return (
    <div className="space-y-5">
      {/* Email Field - Full Width */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2.5">
          Email *
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onChange}
            className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
              errors.email ? 'border-red-400' : 'border-slate-200'
            } text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300`}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number Field - Full Width */}
      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2.5">
          Phone Number * (M-Pesa)
        </label>
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+254712345678"
            value={formData.phone}
            onChange={onChange}
            className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
              errors.phone ? 'border-red-400' : 'border-slate-200'
            } text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
}