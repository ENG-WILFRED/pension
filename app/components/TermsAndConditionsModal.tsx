///home/hp/JERE/pension/app/components/TermsAndConditionsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';
import { MinimalSpinner } from '@/app/components/loaders';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  termsContent?: string;
  loading?: boolean;
}

export default function TermsAndConditionsModal({
  isOpen,
  onClose,
  onAccept,
  termsContent,
  loading = false,
}: TermsAndConditionsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    // Reset scroll state when modal opens
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
              <p className="text-sm text-gray-600">Please read carefully before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none"
          onScroll={handleScroll}
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MinimalSpinner size="lg" />
              <p className="text-gray-600 mt-4">Loading terms and conditions...</p>
            </div>
          ) : termsContent ? (
            <div dangerouslySetInnerHTML={{ __html: termsContent }} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-800 font-semibold mb-2">Terms and Conditions Not Available</p>
              <p className="text-gray-600 text-sm text-center">
                Unable to load the terms and conditions. Please contact support or try again later.
              </p>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {!hasScrolledToBottom && !loading && (
          <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span>Please scroll to the bottom to enable the accept button</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom || loading || !termsContent}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition"
            >
              I Accept Terms & Conditions
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            By accepting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}