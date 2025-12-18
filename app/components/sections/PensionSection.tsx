interface PensionSectionProps {
  formData: { contributionRate?: number; retirementAge?: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PensionSection({ formData, onChange }: PensionSectionProps) {
  return (
    <div className="space-y-2 pb-4 mb-4 border-b">
      <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider">Pension Planning</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        <div>
          <label htmlFor="contributionRate" className="block text-xs font-medium text-gray-700 mb-0.5">
            Contribution (%)
          </label>
          <input
            id="contributionRate"
            name="contributionRate"
            type="number"
            step="0.01"
            value={formData.contributionRate || ''}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="retirementAge" className="block text-xs font-medium text-gray-700 mb-0.5">
            Retirement Age
          </label>
          <input
            id="retirementAge"
            name="retirementAge"
            type="number"
            value={formData.retirementAge || ''}
            onChange={onChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="65"
          />
        </div>

        <div></div>
      </div>
    </div>
  );
}
