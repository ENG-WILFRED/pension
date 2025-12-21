// app/components/ForgotPasswordForm.tsx
'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { GradientBackground } from './ui/GradientBackground';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Password reset link sent to your email');
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          {/* Back Button */}
          <Link 
            href="/login"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Back to Login</span>
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
              <RotateCcw className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Button type="submit" loading={loading}>
              Send Reset Link
            </Button>
          </form>
        </Card>
      </div>
    </GradientBackground>
  );
}