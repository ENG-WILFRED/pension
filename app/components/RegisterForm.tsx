'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { registrationSchema, type RegistrationFormData } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ZodError } from 'zod';

import AccountCredentialsSection from './sections/AccountCredentialsSection';
import PersonalSection from './sections/PersonalSection';
import AddressSection from './sections/AddressSection';
import EmploymentSection from './sections/EmploymentSection';
import PensionSection from './sections/PensionSection';
import PaymentPendingModal from './sections/PaymentPendingModal';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const pollRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<Partial<RegistrationFormData & { confirmPassword?: string }>>({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    spouseName: '',
    spouseDob: '',
    children: [],
    nationalId: '',
    address: '',
    city: '',
    country: '',
    occupation: '',
    employer: '',
    salary: undefined,
    contributionRate: undefined,
    retirementAge: undefined,
  });

  const [paymentPending, setPaymentPending] = useState<{
    transactionId?: string;
    checkoutRequestId?: string;
    statusCheckUrl?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    try {
      registrationSchema.parse(formData);
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
      toast.error('Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const result = await authApi.register(dataToSend as RegistrationFormData);
      if (!result.success) {
        toast.error(result.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const { checkoutRequestId, statusCheckUrl, transactionId, message, status } = result as any;

      if (status === 'payment_initiated' || checkoutRequestId) {
        toast.success(message || 'Payment initiated. Check your phone for the M-Pesa prompt.');
        setPaymentPending({ transactionId, checkoutRequestId, statusCheckUrl });
        setLoading(false);
        setPolling(true);
        return;
      }

      toast.success('✅ Account created successfully. You can now sign in.');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!paymentPending?.transactionId || !polling) return;

    let attempts = 0;
    const maxAttempts = 120;

    const poll = async () => {
      attempts++;
      try {
        const res = await authApi.getRegisterStatus(paymentPending.transactionId as string);
        if (!res.success) {
          if ((res as any).status === 'payment_failed') {
            toast.error((res as any).error || 'Payment failed. Please try again.');
            setPolling(false);
            setLoading(false);
            return;
          }
          console.warn('Status check returned non-success', res);
        } else {
          const s = (res as any).status;
          if (s === 'payment_pending' && attempts === 1) {
            toast('Waiting for payment confirmation...');
          }

          if (s === 'registration_completed') {
            const token = (res as any).token;
            if (token && typeof window !== 'undefined') {
              localStorage.setItem('auth_token', token);
            }
            toast.success('Registration completed — you are now signed in');
            setPolling(false);
            setLoading(false);
            router.push('/dashboard');
            return;
          }

          if (s === 'payment_failed') {
            toast.error((res as any).error || 'Payment failed. Please try again.');
            setPolling(false);
            setLoading(false);
            return;
          }
        }

        if (attempts >= maxAttempts) {
          toast.error('Registration timeout. Please try again.');
          setPolling(false);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    };

    poll();
    pollRef.current = window.setInterval(poll, 2000) as unknown as number;

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [paymentPending?.transactionId, polling, router]);

  if (paymentPending) {
    return (
      <PaymentPendingModal
        transactionId={paymentPending.transactionId}
        onCancel={() => {
          setPolling(false);
          setPaymentPending(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
      {/* Image Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 min-h-screen">
        <div className="text-center">
          <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="80" r="50" fill="#E0E7FF" opacity="0.2"/>
            <path d="M70 100 L100 60 L130 100 M100 60 L100 140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            <rect x="60" y="140" width="80" height="8" rx="4" fill="#FCD34D"/>
            <path d="M50 120 Q100 110 150 120" stroke="#A78BFA" strokeWidth="2" opacity="0.5" strokeDasharray="5,5"/>
            <g opacity="0.3">
              <circle cx="40" cy="40" r="3" fill="#FFFFFF"/>
              <circle cx="160" cy="50" r="2" fill="#FFFFFF"/>
              <circle cx="50" cy="170" r="2.5" fill="#FFFFFF"/>
              <circle cx="170" cy="160" r="2" fill="#FFFFFF"/>
            </g>
          </svg>
          <h2 className="text-3xl font-bold text-white mb-3">Secure Your Future</h2>
          <p className="text-indigo-100 text-lg">Plan your retirement with confidence</p>
        </div>
      </div>

      {/* Form Panel - Full height with scrolling */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
              <p className="text-sm text-gray-600">Start planning your retirement today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-1 flex flex-col h-full">
              <AccountCredentialsSection
                formData={{
                  email: formData.email as string,
                  phone: formData.phone as string,
                  password: formData.password as string,
                  confirmPassword: formData.confirmPassword,
                }}
                errors={errors}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onPasswordToggle={() => setShowPassword(!showPassword)}
                onConfirmPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                onChange={handleChange}
              />

              <PersonalSection
                formData={{
                  firstName: formData.firstName as string,
                  lastName: formData.lastName as string,
                  gender: formData.gender as string,
                  dateOfBirth: formData.dateOfBirth as string,
                  nationalId: formData.nationalId as string,
                  maritalStatus: formData.maritalStatus as string,
                  spouseName: formData.spouseName as string,
                  spouseDob: formData.spouseDob as string,
                }}
                errors={errors}
                onChange={handleChange}
              />

              <AddressSection
                formData={{
                  address: formData.address as string,
                  city: formData.city as string,
                  country: formData.country as string,
                }}
                onChange={handleChange}
              />

              <EmploymentSection
                formData={{
                  occupation: formData.occupation as string,
                  employer: formData.employer as string,
                  salary: formData.salary,
                }}
                onChange={handleChange}
              />

              <PensionSection
                formData={{
                  contributionRate: formData.contributionRate,
                  retirementAge: formData.retirementAge,
                }}
                onChange={handleChange}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account & Pay 1 KES'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-gray-600 text-xs">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
