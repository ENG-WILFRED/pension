'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, termsApi } from '@/app/lib/api-client';
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
import TermsAndConditionsModal from './TermsAndConditionsModal';

// API TIMEOUT CONSTANTS
const API_TIMEOUT = 60000; // 60 seconds per request
const PAYMENT_TOTAL_TIMEOUT = 240000; // 4 minutes total for payment confirmation
const POLL_INTERVAL = 2000; // 2 seconds between polls

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number | null>(null);
  const pollAttemptsRef = useRef<number>(0);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string>(''); 
  const [termsContent, setTermsContent] = useState<string>('');
  const [loadingTerms, setLoadingTerms] = useState(false);

  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    // Account credentials
    email: '',
    phone: '',
    pin: '',
    
    // Bank account details
    bankAccountName: '',
    bankAccountNumber: '',
    bankBranchName: '',
    bankBranchCode: '',
    bankName: '',
    
    // Personal information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    spouseName: '',
    spouseDob: '',
    children: [],
    nationalId: '',
    
    // Address
    address: '',
    city: '',
    country: '',
    
    // Employment
    occupation: '',
    employer: '',
    salary: undefined,
    
    // Pension details
    contributionRate: undefined,
    retirementAge: undefined,
    accountType: 'MANDATORY',
    riskProfile: 'MEDIUM',
    currency: 'KES',
    accountStatus: 'ACTIVE',
    kycVerified: false,
    complianceStatus: 'PENDING',
  });

  const [paymentPending, setPaymentPending] = useState<{
    transactionId?: string;
    checkoutRequestId?: string;
    statusCheckUrl?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const numericFields = ['salary', 'contributionRate', 'retirementAge'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? (value ? Number(value) : undefined) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Multi-step UI state
  const [step, setStep] = useState(0);
  const steps = ['Account', 'Personal', 'Address', 'Employment', 'Pension & Bank'];

  const validateStep = (idx: number) => {
    const e: Record<string, string> = {};
    if (idx === 0) {
      if (!formData.email) e.email = 'Email is required';
      if (!formData.phone) e.phone = 'Phone is required';
      if (formData.pin && formData.pin.trim() !== '' && !/^\d{4}$/.test(formData.pin)) {
        e.pin = 'PIN must be exactly 4 digits if provided';
      }
    }
    if (idx === 4) {
      if (!formData.bankAccountName) e.bankAccountName = 'Bank account name is required';
      if (!formData.bankAccountNumber) e.bankAccountNumber = 'Bank account number is required';
      if (!formData.bankBranchName) e.bankBranchName = 'Bank branch name is required';
      if (!formData.bankBranchCode) e.bankBranchCode = 'Bank branch code is required';
      if (!formData.bankName) e.bankName = 'Bank name is required';
      if (formData.contributionRate == null) e.contributionRate = 'Select contribution rate';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      setTermsError('');
    }
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!validateStep(step)) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!termsAccepted) {
      setTermsError('You must accept the Terms and Conditions to continue');
      toast.error('⚠️ Please accept the Terms and Conditions');
      return;
    }
    
    handleSubmit(new Event('submit') as unknown as FormEvent);
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step > 0) setStep(step - 1);
  };

  const validateForm = () => {
    try {
      const cleanedData = {
        ...formData,
        pin: formData.pin && formData.pin.trim() !== '' ? formData.pin : undefined,
      };
      
      registrationSchema.parse(cleanedData);
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

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setTermsError('');
    setShowTermsModal(false);
    toast.success('✅ Terms and Conditions accepted');
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
    toast.info('ℹ️ You must accept the Terms and Conditions to proceed');
  };

  const apiCallWithTimeout = async <T,>(
    apiPromise: Promise<T>,
    timeoutMs: number = API_TIMEOUT
  ): Promise<T> => {
    return Promise.race([
      apiPromise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      ),
    ]);
  };

  // ✅ FIXED: Clear polling interval helper
  const stopPolling = () => {
    console.log('[Register] Stopping polling...');
    setPolling(false);
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollAttemptsRef.current = 0;
    pollStartTimeRef.current = null;
  };

  const handleRegistrationSuccess = (token?: string, user?: any) => {
    console.log('[Register] Registration successful!', { hasToken: !!token, hasUser: !!user });
    
    stopPolling();
    setPaymentPending(null);
    setLoading(false);
    
    // Save auth data
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    toast.success('🎉 Registration completed! Redirecting to dashboard...');
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleSubmit = async (e: FormEvent) => {
    try { e.preventDefault?.(); } catch {}

    if (!validateForm()) {
      toast.error('⚠️ Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        pin: formData.pin && formData.pin.trim() !== '' ? formData.pin : undefined,
        accountType: formData.accountType || 'MANDATORY',
        riskProfile: formData.riskProfile || 'MEDIUM',
        currency: formData.currency || 'KES',
        accountStatus: formData.accountStatus || 'ACTIVE',
        kycVerified: formData.kycVerified || false,
        complianceStatus: formData.complianceStatus || 'PENDING',
      };
      
      const result = await apiCallWithTimeout(
        authApi.register(dataToSend as RegistrationFormData),
        API_TIMEOUT
      );
      
      if (!result.success) {
        const errorMsg = result.error || 'Registration failed';
        if (errorMsg.includes('already')) {
          toast.error('❌ Email or phone already registered');
        } else if (errorMsg.includes('Payment') || errorMsg.includes('payment')) {
          toast.error('💳 Failed to initiate payment. Please check your details and try again.');
        } else if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
          toast.error('⏱️ Request timed out. Please check your connection and try again.');
        } else {
          toast.error(errorMsg);
        }
        setLoading(false);
        return;
      }

      const { checkoutRequestId, statusCheckUrl, transactionId, message, status, token, user } = result as any;

      // ✅ FIXED: Check if already completed
      if (status === 'registration_completed' || token) {
        handleRegistrationSuccess(token, user);
        return;
      }

      if (status === 'payment_initiated' || checkoutRequestId) {
        console.log('[Register] Payment initiated, starting polling...', { transactionId });
        toast.success('💳 M-Pesa prompt sent to your phone!');
        toast.info('📱 Please check your phone and enter your M-Pesa PIN');
        setPaymentPending({ transactionId, checkoutRequestId, statusCheckUrl });
        setLoading(false);
        setPolling(true);
        pollStartTimeRef.current = Date.now();
        pollAttemptsRef.current = 0;
        return;
      }

      // Fallback - shouldn't happen but handle gracefully
      toast.success('✅ Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      if (err.message === 'Request timeout') {
        toast.error('⏱️ Request timed out. Please check your connection and try again.');
      } else {
        toast.error('⚠️ An unexpected error occurred');
      }
      console.error('[Register] Submit error:', err);
      setLoading(false);
    }
  };

  // Fetch Terms and Conditions
  useEffect(() => {
    const fetchTerms = async () => {
      setLoadingTerms(true);
      try {
        const res = await apiCallWithTimeout(termsApi.getCurrent(), API_TIMEOUT);
        if (res.success && res.body) {
          setTermsContent(res.body);
        }
      } catch (err: any) {
        console.error('[Register] Failed to load terms:', err);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, []);

  // ✅ FIXED: Payment status polling with proper cleanup
  useEffect(() => {
    if (!paymentPending?.transactionId || !polling) {
      return;
    }

    console.log('[Register] Starting payment polling...', { transactionId: paymentPending.transactionId });

    const maxAttempts = 120; // 120 * 2s = 240s (4 minutes)

    const poll = async () => {
      pollAttemptsRef.current++;
      const attempts = pollAttemptsRef.current;
      
      // Check total timeout
      const elapsedTime = Date.now() - (pollStartTimeRef.current || Date.now());
      if (elapsedTime > PAYMENT_TOTAL_TIMEOUT) {
        console.log('[Register] Payment timeout reached');
        toast.error('⏱️ Payment confirmation timeout. Please contact support if payment was deducted.');
        stopPolling();
        setPaymentPending(null);
        setLoading(false);
        return;
      }

      // Check max attempts
      if (attempts >= maxAttempts) {
        console.log('[Register] Max polling attempts reached');
        toast.error('⏱️ Maximum attempts reached. Please check the transaction status.');
        stopPolling();
        setPaymentPending(null);
        setLoading(false);
        return;
      }

      try {
        console.log(`[Register] Polling attempt ${attempts}/${maxAttempts}...`);
        
        const res = await apiCallWithTimeout(
          authApi.getRegisterStatus(paymentPending.transactionId as string),
          API_TIMEOUT
        );
        
        console.log('[Register] Poll response:', { success: res.success, status: (res as any).status });

        if (res.success) {
          const { status, token, user } = res as any;
          
          // ✅ FIXED: Immediately handle success
          if (status === 'registration_completed' && token) {
            console.log('[Register] Payment confirmed! Registration complete.');
            handleRegistrationSuccess(token, user);
            return; // Stop polling immediately
          }

          if (status === 'payment_failed') {
            console.log('[Register] Payment failed');
            toast.error('❌ Payment failed. Please try again.');
            stopPolling();
            setPaymentPending(null);
            setLoading(false);
            return;
          }

          // Still pending - continue polling
          if (status === 'payment_pending' && attempts === 1) {
            toast.loading('⏳ Waiting for payment confirmation...');
          }
        } else {
          // Handle error responses
          const status = (res as any).status;
          
          if (status === 'payment_failed') {
            console.log('[Register] Payment failed (from error response)');
            toast.error('❌ Payment failed. Please try again.');
            stopPolling();
            setPaymentPending(null);
            setLoading(false);
            return;
          }
        }
      } catch (err: any) {
        // Silently handle expected timeout errors during polling
        if (err.message !== 'Request timeout') {
          console.error('[Register] Poll error:', err);
        }
      }
    };

    // Start polling immediately
    poll();
    
    // Then poll every 2 seconds
    pollRef.current = setInterval(poll, POLL_INTERVAL);

    // Cleanup
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [paymentPending?.transactionId, polling, router]);

  // ✅ FIXED: Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  if (paymentPending) {
    return (
      <PaymentPendingModal
        transactionId={paymentPending.transactionId}
        onCancel={() => {
          console.log('[Register] User cancelled payment');
          stopPolling();
          setPaymentPending(null);
          setLoading(false);
          toast.info('ℹ️ Payment confirmation cancelled. You can try registering again.');
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row">
        {/* Branding Panel - Desktop only */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 items-center justify-center p-12 min-h-screen relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <img
                  src="/pensions.jpeg"
                  alt="AutoNest Pension logo"
                  className="w-28 h-28 object-cover rounded-2xl shadow-xl border-2 border-white/20"
                />
              </div>
            </div>

            <h1 className="text-5xl font-black text-white mb-4 leading-tight">Secure Your<br />Future Today</h1>
            
            <p className="text-xl text-blue-100 mb-8 font-medium">Start your AutoNest Pension journey in minutes</p>

            <div className="space-y-4 text-left mt-12 pt-8 border-t border-white/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Create Account</p>
                  <p className="text-blue-100 text-xs">Quick registration in 5 steps</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Quick Payment</p>
                  <p className="text-blue-100 text-xs">Only 1 KES via M-Pesa</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Start Growing</p>
                  <p className="text-blue-100 text-xs">Access your pension account</p>
                </div>
              </div>
            </div>

            <p className="text-white/60 text-xs mt-12 pt-8 border-t border-white/10">
              Join thousands managing their retirement with AutoNest Pension
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto flex flex-col rounded-none shadow-2xl">
          <div className="flex items-center justify-between gap-4 p-6 border-b">
            <div className="flex items-center gap-3">
              <img src="/pensions.jpeg" alt="AutoNest Pension" className="w-8 h-8 rounded-md object-cover shadow-sm" />
              <div className="text-lg font-semibold text-gray-900">AutoNest Pension</div>
            </div>
            <div>
              <Link href="/login" className="text-sm bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 px-4 py-2 rounded-lg shadow-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition">Already registered? Sign in</Link>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-1">Step <span className="font-bold text-indigo-600">{step + 1}</span> of <span className="font-bold text-indigo-600">{steps.length}</span> — <span className="font-semibold">{steps[step]}</span></p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            <form className="space-y-6 min-h-[55vh]" onSubmit={handleSubmit}>
              <div className="space-y-4 min-h-[50vh] flex flex-col">
                {step === 0 && (
                  <div className="transform scale-100">
                    <AccountCredentialsSection
                      formData={{
                        email: formData.email as string,
                        phone: formData.phone as string,
                        pin: formData.pin as string,
                      }}
                      errors={errors}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="transform scale-100">
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
                  </div>
                )}

                {step === 2 && (
                  <AddressSection
                    formData={{
                      address: formData.address as string,
                      city: formData.city as string,
                      country: formData.country as string,
                    }}
                    onChange={handleChange}
                  />
                )}

                {step === 3 && (
                  <EmploymentSection
                    formData={{
                      occupation: formData.occupation as string,
                      employer: formData.employer as string,
                      salary: formData.salary,
                    }}
                    onChange={handleChange}
                  />
                )}

                {step === 4 && (
                  <PensionSection
                    formData={{
                      contributionRate: formData.contributionRate,
                      retirementAge: formData.retirementAge,
                      bankAccountName: formData.bankAccountName as string,
                      bankAccountNumber: formData.bankAccountNumber as string,
                      bankBranchName: formData.bankBranchName as string,
                      bankBranchCode: formData.bankBranchCode as string,
                      bankName: formData.bankName as string,
                      accountType: formData.accountType,
                      riskProfile: formData.riskProfile,
                    }}
                    errors={errors}
                    onChange={handleChange}
                    termsAccepted={termsAccepted}
                    onTermsChange={handleTermsChange}
                    onTermsClick={handleTermsClick}
                    termsError={termsError}
                  />
                )}
              </div>
            </form>
          </div>

          <div className="border-t bg-white p-4 lg:p-6 sticky bottom-0 shadow-xl">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold border-2 text-base transition ${step === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50' : 'text-indigo-700 border-indigo-300 hover:bg-indigo-50 bg-white'}`}
                >
                  ← Back
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-base font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-base font-semibold hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => { setStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-3 h-3 rounded-full transition ${i <= step ? 'bg-indigo-600 w-8 rounded-full' : 'bg-gray-300 hover:bg-gray-400'} focus:outline-none`}
                    aria-label={`Step ${i + 1}`}
                    title={s}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
        termsContent={termsContent}
        loading={loadingTerms}
      />
    </>
  );
}