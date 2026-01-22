interface PensionSectionProps {
  formData: {
    contributionRate?: number;
    retirementAge?: number;
    accountType?: string;
    riskProfile?: string;
  };
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  onTermsClick: () => void;
  termsError?: string;
}

export default function PensionSection({
  formData,
  errors,
  onChange,
  termsAccepted,
  onTermsChange,
  onTermsClick,
  termsError,
}: PensionSectionProps) {
  return (
    <div className="space-y-6 pb-6 mb-6">
      {/* Pension Planning */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider pb-2 border-b">Pension Planning</h3>

        {/* 2 Rows x 2 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Row 1, Column 1 - Account Type */}
          <div>
            <label
              htmlFor="accountType"
              className="block text-sm font-medium text-gray-700 mb-2.5"
            >
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType || "MANDATORY"}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            >
              <option value="MANDATORY">Mandatory</option>
              <option value="VOLUNTARY">Voluntary</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          {/* Row 1, Column 2 - Risk Profile */}
          <div>
            <label
              htmlFor="riskProfile"
              className="block text-sm font-medium text-gray-700 mb-2.5"
            >
              Risk Profile
            </label>
            <select
              id="riskProfile"
              name="riskProfile"
              value={formData.riskProfile || "MEDIUM"}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            >
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          {/* Row 2, Column 1 - Contribution Rate */}
          <div>
            <label
              htmlFor="contributionRate"
              className="block text-sm font-medium text-gray-700 mb-2.5"
            >
              Contribution Rate (%)
            </label>
            <select
              id="contributionRate"
              name="contributionRate"
              value={formData.contributionRate ?? ""}
              onChange={onChange}
              className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 ${
                errors.contributionRate ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select rate</option>
              <option value="2">2%</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
            </select>
            {errors.contributionRate && (
              <p className="text-red-600 text-xs mt-1.5">
                {errors.contributionRate}
              </p>
            )}
          </div>

          {/* Row 2, Column 2 - Retirement Age */}
          <div>
            <label
              htmlFor="retirementAge"
              className="block text-sm font-medium text-gray-700 mb-2.5"
            >
              Retirement Age
            </label>
            <input
              id="retirementAge"
              name="retirementAge"
              type="number"
              min="50"
              max="80"
              step="1"
              value={formData.retirementAge || ""}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="65"
            />
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div
          className={`bg-gray-50 rounded-xl p-5 border-2 ${
            termsError ? "border-red-300 bg-red-50" : "border-gray-200"
          } transition-colors`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="termsAccepted"
              className="flex-1 text-sm text-gray-700 leading-relaxed cursor-pointer"
            >
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onTermsClick();
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors"
              >
                Terms and Conditions
              </button>{" "}
              of this pension management system.
            </label>
          </div>

          {termsError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{termsError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}