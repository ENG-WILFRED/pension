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
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-orange-600 dark:text-orange-400" />
          Bank Account
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 dark:text-orange-400" />
        </div>
      </div>
    );
  }

  // Show message if no bank account details
  if (!bankAccount || !bankAccount.bankName) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-orange-600 dark:text-orange-400" />
          Bank Account
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 dark:text-amber-400 mb-3" />
          <p className="text-slate-600 dark:text-slate-400 mb-2 font-semibold">No bank account details found</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
            Please add your bank information to receive payments
          </p>
          <Link 
            href="/settings/bank-details"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl transition-all text-sm font-bold inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            <CreditCard size={16} />
            Add Bank Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
          <CreditCard size={20} className="text-orange-600 dark:text-orange-400" />
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
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Bank:</span>
          <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300">
            {bankAccount.bankName}
          </span>
        </div>
        
        {bankAccount.accountName && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Account Name:</span>
            <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300">
              {bankAccount.accountName}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Account Number:</span>
          <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300 font-mono">
            ****{bankAccount.accountNumber?.slice(-4) || '****'}
          </span>
        </div>
        
        {bankAccount.branchName && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Branch:</span>
            <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300">
              {bankAccount.branchName}
            </span>
          </div>
        )}
        
        {bankAccount.branchCode && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Branch Code:</span>
            <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300 font-mono">
              {bankAccount.branchCode}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center border-t-2 border-slate-200 dark:border-slate-700 pt-3 mt-3 transition-colors duration-300">
          <span className="text-slate-500 dark:text-slate-400 transition-colors duration-300 font-medium">Status:</span>
          <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-colors duration-300">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}