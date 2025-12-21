// app/components/LoginForm.tsx
'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api-client';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { GradientBackground } from './ui/GradientBackground';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authApi.login({
        identifier: formData.email, // Can be email, username, or phone
        password: formData.password,
      });

      if (!result.success) {
        toast.error(result.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Check if token is returned (successful login) or OTP is required
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.success('OTP sent to your email');
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          {/* Back Button */}
          <Link 
            href="/"
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
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Sign in to manage your pension
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" loading={loading}>
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </Card>
      </div>
    </GradientBackground>
  );
}