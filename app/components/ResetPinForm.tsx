'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import {
  requestPinResetSchema,
  verifyPinResetSchema,
  type RequestPinResetFormData,
  type VerifyPinResetFormData,
} from '@/app/lib/schemas';
import { toast } from 'sonner';
import { ButtonLoader } from '@/app/components/loaders';
import { ZodError } from 'zod';

export default function ResetPinForm() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();

    const phoneValue = formData.phone || phone;

    try {
      requestPinResetSchema.parse({ phone: phoneValue });
      setErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.requestPinReset({ phone: phoneValue });

      if (res.success) {
        toast.success('📱 OTP sent to your phone');
        setPhone(phoneValue);
        setFormData(prev => ({ ...prev, phone: phoneValue }));
        setStep('verify');
      } else {
        toast.error(res.error || '❌ Failed to request PIN reset');
      }
    } catch (err: any) {
      console.error('Error requesting PIN reset:', err);
      toast.error('❌ An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e: FormEvent) => {
    e.preventDefault();

    try {
      verifyPinResetSchema.parse({
        phone: formData.phone || phone,
        otp: formData.otp,
        newPin: formData.newPin,
      });
      setErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.verifyPinReset({
        phone: formData.phone || phone,
        otp: formData.otp,
        newPin: formData.newPin,
      });

      if (res.success) {
        toast.success('✅ PIN reset successfully');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        toast.error(res.error || '❌ Failed to reset PIN');
      }
    } catch (err: any) {
      console.error('Error verifying PIN reset:', err);
      toast.error('❌ An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset PIN</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Enter your phone number to receive an OTP</p>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254712345678"
                className={`w-full border rounded-lg p-3 ${
                  errors.phone
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading && <ButtonLoader size="sm" />}
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verify OTP</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Enter the OTP sent to {phone} and your new PIN</p>

        <form onSubmit={handleVerifyReset} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              maxLength={6}
              inputMode="numeric"
              value={formData.otp}
              onChange={handleChange}
              placeholder="000000"
              className={`w-full border rounded-lg p-3 ${
                errors.otp
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.otp && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.otp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              New PIN
            </label>
            <input
              type="password"
              name="newPin"
              maxLength={4}
              inputMode="numeric"
              value={formData.newPin}
              onChange={handleChange}
              placeholder="1234"
              className={`w-full border rounded-lg p-3 ${
                errors.newPin
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.newPin && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.newPin}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading && <ButtonLoader size="sm" />}
            {loading ? 'Resetting PIN...' : 'Reset PIN'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('request');
              setFormData({ phone: '', otp: '', newPin: '' });
              setErrors({});
            }}
            className="w-full text-indigo-600 dark:text-indigo-400 font-semibold py-2 hover:underline"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
