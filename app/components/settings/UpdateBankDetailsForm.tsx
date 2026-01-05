// /app/components/settings/UpdateBankDetailsForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { userApi } from "@/app/lib/api-client";
import { CreditCard, Save } from "lucide-react";

interface UpdateBankDetailsFormProps {
  userId: string;
  currentBankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branchCode?: string;
  };
  onSuccess?: () => void;
}

export default function UpdateBankDetailsForm({ 
  userId, 
  currentBankDetails,
  onSuccess 
}: UpdateBankDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: currentBankDetails?.bankName || "",
    accountNumber: currentBankDetails?.accountNumber || "",
    accountName: currentBankDetails?.accountName || "",
    branchCode: currentBankDetails?.branchCode || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.updateBankDetails(userId, formData);

      if (response.success) {
        toast.success("✅ Bank details updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.error || "Failed to update bank details");
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Failed to update bank details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
        Update Bank Details
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            placeholder="e.g., Equity Bank"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            placeholder="e.g., John Doe"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Number *
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            placeholder="e.g., 1234567890"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch Code
          </label>
          <input
            type="text"
            name="branchCode"
            value={formData.branchCode}
            onChange={handleChange}
            placeholder="e.g., 011"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            <>
              <Save size={18} />
              Update Bank Details
            </>
          )}
        </button>
      </form>
    </div>
  );
}