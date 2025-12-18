"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import OtpInput from '@/app/components/OtpInput';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpValue = otp.join('');

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.verifyOtp({
        email: email || '',
        otp: otpValue,
      });

      if (!result.success) {
        toast.error(result.error || 'OTP verification failed');
        setLoading(false);
        return;
      }

      toast.success('OTP verified successfully!');
      
      // Store tokens
      localStorage.setItem('access_token', result.data?.accessToken || '');
      localStorage.setItem('refresh_token', result.data?.refreshToken || '');
      localStorage.setItem('auth_token', result.data?.accessToken || '');

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const result = await authApi.sendOtp({
        email: email || '',
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to resend OTP');
        setResendLoading(false);
        return;
      }

      toast.success('OTP sent to your email');
      setOtp(Array(6).fill(''));
      setTimer(60);
      
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-8">
          Enter the 6-digit code sent to <br />
          <span className="font-semibold">{email}</span>
        </p>

        <div className="mb-8">
          <OtpInput value={otp} onChange={setOtp} isLoading={loading} />
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otpValue.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timer > 0}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
          >
            {resendLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
