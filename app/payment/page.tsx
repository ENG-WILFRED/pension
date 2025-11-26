'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { initiateStkPush } from '@/app/actions/payment';

interface PaymentResult {
  transactionId: string;
  checkoutId: string;
  phoneNumber: string;
  amount: number;
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result: any = await initiateStkPush({
        phoneNumber: formData.phoneNumber,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
      });

      if (!result.success) {
        setError(result.error || 'Payment initiation failed');
        return;
      }

      setSuccess(true);
      setPaymentResult({
        transactionId: result.transaction.id,
        checkoutId: result.transaction.checkoutId,
        phoneNumber: formData.phoneNumber,
        amount: result.transaction.amount,
      });

      setFormData({ phoneNumber: '', amount: '', description: '' });
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success && paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Payment Initiated Successfully!
            </h3>
            <p className="mt-2 text-sm text-gray-600 mb-6">
              An STK push has been sent to your M-Pesa phone
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  KES {paymentResult.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold text-gray-900">
                  {paymentResult.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs text-gray-900 break-all">
                  {paymentResult.transactionId}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setPaymentResult(null);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Make Another Payment
              </button>
              <Link
                href="/dashboard"
                className="w-full block bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">M-Pesa Payment</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm text-black  font-medium">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="254712345678 or 0712345678"
              className="mt-1 w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Kenyan phone number where the STK push will be sent
            </p>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-black">
              Amount (KES)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              max="150000"
              step="0.01"
              placeholder="100.00"
              className="mt-1 w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum KES 1, Maximum KES 150,000
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Payment for services"
              rows={3}
              className="mt-1 w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? 'Sending STK Push...' : 'Send STK Push'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          By proceeding, you agree to complete the M-Pesa payment when prompted on your phone.
        </p>
      </div>
    </div>
  );
}
