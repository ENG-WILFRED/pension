// app/components/sections/PaymentPendingModal.tsx
import { Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GradientBackground } from '../ui/GradientBackground';

interface PaymentPendingModalProps {
  transactionId?: string;
  onCancel: () => void;
}

export default function PaymentPendingModal({ transactionId, onCancel }: PaymentPendingModalProps) {
  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            {/* Loading Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Payment Pending
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Your registration is pending payment. Please complete the M-Pesa prompt on your phone.
            </p>

            {/* Transaction ID */}
            {transactionId && (
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {transactionId}
                </p>
              </div>
            )}

            {/* Waiting message */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-sm text-gray-600">Waiting for payment confirmation</span>
            </div>

            {/* Cancel Button */}
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>

            {/* Help text */}
            <p className="mt-4 text-xs text-gray-500">
              If you completed payment but registration fails, please wait a few seconds and try again.
            </p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </GradientBackground>
  );
}