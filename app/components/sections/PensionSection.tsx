interface PensionSectionProps {
  formData: { contributionRate?: number; retirementAge?: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  onTermsClick: () => void;
  termsError?: string;
}

export default function PensionSection({ 
  formData, 
  onChange, 
  termsAccepted, 
  onTermsChange, 
  onTermsClick,
  termsError 
}: PensionSectionProps) {
  return (
    <div className="space-y-6 pb-4 mb-4">
      <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider border-b pb-2">Pension Planning</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="contributionRate" className="block text-sm font-medium text-gray-700 mb-1">
            Contribution (%)
          </label>
          <select
            id="contributionRate"
            name="contributionRate"
            value={formData.contributionRate ?? ''}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          >
            <option value="">Select rate</option>
            <option value="2">2%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
          </select>
        </div>

        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
            Retirement Age
          </label>
          <input
            id="retirementAge"
            name="retirementAge"
            type="number"
            min="50"
            max="80"
            step="1"
            value={formData.retirementAge || ''}
            onChange={onChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="65"
          />
        </div>

        <div></div>
      </div>

      {/* 🆕 Terms and Conditions Checkbox */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className={`bg-gray-50 rounded-xl p-5 border-2 ${termsError ? 'border-red-300 bg-red-50' : 'border-gray-200'} transition-colors`}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="termsAccepted" className="flex-1 text-sm text-gray-700 leading-relaxed cursor-pointer">
              I have read and agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onTermsClick();
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors"
              >
                Terms and Conditions
              </button>
              {' '}of this pension management system.
            </label>
          </div>
          
          {termsError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{termsError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}