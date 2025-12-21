// app/components/RegisterForm.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { registrationSchema, type RegistrationFormData } from '@/app/lib/schemas';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, Calendar, MapPin, Briefcase, TrendingUp, Check } from 'lucide-react';
import { ZodError } from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { GradientBackground } from './ui/GradientBackground';
import PaymentPendingModal from './sections/PaymentPendingModal';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 5;

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Account Credentials
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields');
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

  const isMarried = formData.maritalStatus === 'Married';

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-2xl p-6 md:p-8 my-8">
          {/* Back Button */}
          <Link 
            href="/login"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Back</span>
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`h-1 w-full mt-5 -ml-full transition ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      style={{ position: 'absolute', width: 'calc(20% - 10px)', left: `${(step - 1) * 20 + 10}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Account</span>
              <span>Personal</span>
              <span>Address</span>
              <span>Employment</span>
              <span>Pension</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Account Credentials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Account Credentials
                </h3>
                
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  error={errors.email}
                  required
                />

                <Input
                  label="Phone * (M-Pesa)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254712345678"
                  icon={<Phone className="w-5 h-5" />}
                  error={errors.phone}
                  required
                />

                <div className="relative">
                  <Input
                    label="Password *"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password *"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    icon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    icon={<User className="w-5 h-5" />}
                  />

                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    icon={<User className="w-5 h-5" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    icon={<Calendar className="w-5 h-5" />}
                  />
                </div>

                <Input
                  label="National ID"
                  name="nationalId"
                  type="text"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="ID Number"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {isMarried && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Spouse Name"
                      name="spouseName"
                      type="text"
                      value={formData.spouseName}
                      onChange={handleChange}
                      placeholder="Spouse full name"
                    />

                    <Input
                      label="Spouse Date of Birth"
                      name="spouseDob"
                      type="date"
                      value={formData.spouseDob}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Address Information
                </h3>
                
                <Input
                  label="Street Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  icon={<MapPin className="w-5 h-5" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                  <Input
                    label="Country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Employment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Employment Information
                </h3>
                
                <Input
                  label="Occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Your job title"
                  icon={<Briefcase className="w-5 h-5" />}
                />

                <Input
                  label="Employer"
                  name="employer"
                  type="text"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="Company name"
                  icon={<Briefcase className="w-5 h-5" />}
                />

                <Input
                  label="Monthly Salary (KES)"
                  name="salary"
                  type="number"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Step 5: Pension Planning */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Pension Planning
                </h3>
                
                <Input
                  label="Contribution Rate (%)"
                  name="contributionRate"
                  type="number"
                  step="0.01"
                  value={formData.contributionRate || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  icon={<TrendingUp className="w-5 h-5" />}
                />

                <Input
                  label="Retirement Age"
                  name="retirementAge"
                  type="number"
                  value={formData.retirementAge || ''}
                  onChange={handleChange}
                  placeholder="65"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="secondary"
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button type="submit" loading={loading} className="flex-1">
                  Create Account & Pay 1 KES
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </GradientBackground>
  );
}