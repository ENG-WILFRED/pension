'use client';

import { FormEvent, useState } from 'react';
import { authApi } from '@/app/lib/api-client';
import { changePinSchema, type ChangePinFormData } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ZodError } from 'zod';

interface Props {
  onSuccess?: () => void;
}

export default function ChangePinForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    currentPin: '',
    newPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      changePinSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('⚠️ Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.changePin({
        currentPin: formData.currentPin,
        newPin: formData.newPin,
      });

      if (result.success) {
        toast.success('✅ PIN changed successfully');
        setFormData({ currentPin: '', newPin: '' });
        onSuccess?.();
      } else {
        toast.error(result.error || '❌ Failed to change PIN');
      }
    } catch (err: any) {
      console.error('Error changing PIN:', err);
      toast.error('❌ An error occurred while changing PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Current PIN
        </label>
        <input
          type="password"
          inputMode="numeric"
          name="currentPin"
          maxLength={4}
          value={formData.currentPin}
          onChange={handleChange}
          placeholder="Enter 4-digit PIN"
          className={`w-full border rounded-lg p-3 ${
            errors.currentPin
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.currentPin && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.currentPin}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          New PIN
        </label>
        <input
          type="password"
          inputMode="numeric"
          name="newPin"
          maxLength={4}
          value={formData.newPin}
          onChange={handleChange}
          placeholder="Enter new 4-digit PIN"
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
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Changing PIN...' : 'Change PIN'}
      </button>
    </form>
  );
}
