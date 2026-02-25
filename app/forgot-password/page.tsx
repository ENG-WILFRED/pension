///home/hp/JERE/AutoNest/app/forgot-password/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import OtpInput from '@/app/components/OtpInput';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify'>('request');

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const otpValue = otp.join('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const requestOtp = async () => {
    if (!identifier) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ identifier });
      if (!res.success) {
        toast.error(res.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }
      toast.success('OTP sent to your email');
      try { localStorage.setItem('auth_identifier', identifier); } catch {}
      setStep('verify');
      setLoading(false);
    } catch (err) {
      toast.error('Unexpected error. Try again.');
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const verifyOtpAndReset = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    if (!validatePassword()) return;
    setLoading(true);
    try {
      const id = identifier || (typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : '') || '';
      const res = await authApi.verifyForgotPassword({ identifier: id, otp: otpValue, newPassword });
      if (!res.success) {
        toast.error(res.error || 'Failed to reset password');
        setLoading(false);
        return;
      }
      toast.success('Password reset successful — please login');
      setTimeout(() => router.push('/login'), 800);
    } catch (err) {
      toast.error('Unexpected error. Try again.');
      setLoading(false);
    }
  };

  const handleBack = () => router.back();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('auth_identifier') : null;
    if (stored) setIdentifier(stored);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto w-full text-white">
          <h1 className="text-5xl lg:text-6xl font-black mb-4">Forgot Password</h1>
          <p className="text-lg text-slate-300">We'll send a one-time code to your email to reset your password.</p>
        </div>
      </div>

      <div className="lg:w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <button onClick={handleBack} className="mb-6 flex items-center text-slate-600 hover:text-slate-900 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            {step === 'request' ? (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 rounded-2xl mb-4">
                    <Mail className="w-8 h-8 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h2>
                  <p className="text-sm text-slate-600">Enter the email associated with your account.</p>
                </div>

                <label className="block text-xs font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-3 px-4 border rounded-xl text-sm mb-4"
                  disabled={loading}
                />

                <button onClick={requestOtp} className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-95" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset code'}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter the code</h2>
                  <p className="text-sm text-slate-600">We sent a 6-digit code to <span className="font-semibold text-orange-600">{identifier}</span></p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-2">One-Time Password</label>
                  <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-2">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full pl-10 pr-10 py-3 bg-white border rounded-xl text-sm mb-2"
                      disabled={loading}
                    />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full py-3 px-4 border rounded-xl text-sm"
                    disabled={loading}
                  />
                </div>

                <button onClick={verifyOtpAndReset} className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-95" disabled={loading}>
                  {loading ? 'Processing...' : 'Reset password'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
