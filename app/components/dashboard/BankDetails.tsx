import { CreditCard, AlertCircle, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BankAccount {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchCode?: string;
  branchName?: string;
}

interface BankDetailsProps {
  bankAccount?: BankAccount;
  loading?: boolean;
  onEdit?: () => void;
}

export default function BankDetailsComponent({ bankAccount, loading = false, onEdit }: BankDetailsProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
              <CreditCard size={20} className="text-white" />
            </div>
            Bank Account
          </h3>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    );
  }

  // Show message if no bank account details
  if (!bankAccount || !bankAccount.bankName) {
    return (
      <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
              <CreditCard size={20} className="text-white" />
            </div>
            Bank Account
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-2 font-bold transition-colors duration-300">No bank account details found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
              Please add your bank information to receive payments
            </p>
            {onEdit ? (
              <button
                onClick={onEdit}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white rounded-xl transition-all text-sm font-bold inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
              >
                <CreditCard size={16} />
                Add Bank Details
              </button>
            ) : (
              <Link 
                href="/settings/bank-details"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white rounded-xl transition-all text-sm font-bold inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
              >
                <CreditCard size={16} />
                Add Bank Details
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg shadow-md">
              <CreditCard size={20} className="text-white" />
            </div>
            Bank Account
          </h3>
          {onEdit ? (
            <button
              onClick={onEdit}
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors p-2 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg"
              title="Edit bank details"
            >
              <Edit size={18} />
            </button>
          ) : (
            <Link
              href="/settings/bank-details"
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors p-2 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg"
              title="Edit bank details"
            >
              <Edit size={18} />
            </Link>
          )}
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Bank:</span>
            <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {bankAccount.bankName}
            </span>
          </div>
          
          {bankAccount.accountName && (
            <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Account Name:</span>
              <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {bankAccount.accountName}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Account Number:</span>
            <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300 font-mono">
              ****{bankAccount.accountNumber?.slice(-4) || '****'}
            </span>
          </div>
          
          {bankAccount.branchName && (
            <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Branch:</span>
              <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {bankAccount.branchName}
              </span>
            </div>
          )}
          
          {bankAccount.branchCode && (
            <div className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Branch Code:</span>
              <span className="font-bold text-gray-900 dark:text-white transition-colors duration-300 font-mono">
                {bankAccount.branchCode}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center border-t-2 border-orange-100 dark:border-orange-900/30 pt-3 mt-3 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors duration-200">
            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">Status:</span>
            <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold shadow-sm transition-colors duration-300">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}