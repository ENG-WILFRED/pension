///home/hp/JERE/pension/app/components/sections/AccountCredentialsSection.tsx
import { Eye, EyeOff } from 'lucide-react';

interface AccountCredentialsSectionProps {
  formData: { email: string; phone: string; password: string; confirmPassword?: string };
  errors: Record<string, string>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AccountCredentialsSection({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  onPasswordToggle,
  onConfirmPasswordToggle,
  onChange,
}: AccountCredentialsSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Account Credentials</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
            className={`w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-0.5">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-0.5">
            Phone * (M-Pesa)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            required
            className={`w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+254712345678"
          />
          {errors.phone && <p className="text-red-600 text-xs mt-0.5">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-0.5">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={onChange}
              required
              className={`w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-9 text-gray-900 placeholder-gray-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={onPasswordToggle}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-xs mt-0.5">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-0.5">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={onChange}
              required
              className={`w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-9 text-gray-900 placeholder-gray-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={onConfirmPasswordToggle}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-xs mt-0.5">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );
}
