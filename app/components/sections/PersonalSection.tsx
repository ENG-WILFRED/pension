'use client';

interface PersonalSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationalId: string;
    maritalStatus: string;
    spouseName: string;
    spouseDob: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PersonalSection({ formData, errors, onChange }: PersonalSectionProps) {
  const isMarried = formData.maritalStatus === 'Married';

  // Calculate max date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6 pb-6 mb-6 border-b border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Personal Information</h3>

      {/* 2 Columns x 3 Rows Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1 - First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2.5">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
            placeholder="John"
          />
        </div>

        {/* Row 1 - Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2.5">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
            placeholder="Doe"
          />
        </div>

        {/* Row 2 - Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-bold text-slate-700 mb-2.5">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 cursor-pointer"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Row 2 - Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-bold text-slate-700 mb-2.5">
            Date of Birth <span className="text-xs text-slate-500 font-normal">(18+ required)</span>
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            max={getMaxDate()}
            value={formData.dateOfBirth}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
          />
          {errors.dateOfBirth && (
            <p className="mt-2 text-xs text-red-600 font-medium">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Row 3 - National ID */}
        <div>
          <label htmlFor="nationalId" className="block text-sm font-bold text-slate-700 mb-2.5">
            National ID / Passport
          </label>
          <input
            id="nationalId"
            name="nationalId"
            type="text"
            value={formData.nationalId}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300"
            placeholder="Your ID number"
          />
        </div>

        {/* Row 3 - Marital Status */}
        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-bold text-slate-700 mb-2.5">
            Marital Status
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={onChange}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 transition-all duration-300 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 cursor-pointer"
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>

      {/* Spouse Information - Conditional (2 columns when married) */}
      {isMarried && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/10 dark:to-pink-900/10 p-6 rounded-2xl border-2 border-orange-100 dark:border-orange-800/30 mt-6">
          <div>
            <label htmlFor="spouseName" className="block text-sm font-bold text-slate-700 mb-2.5">
              Spouse Name
            </label>
            <input
              id="spouseName"
              name="spouseName"
              type="text"
              value={formData.spouseName}
              onChange={onChange}
              className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-orange-200 text-slate-900 placeholder-slate-400 transition-all duration-300 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300"
              placeholder="Spouse's full name"
            />
          </div>

          <div>
            <label htmlFor="spouseDob" className="block text-sm font-bold text-slate-700 mb-2.5">
              Spouse DOB <span className="text-xs text-slate-500 font-normal">(18+ required)</span>
            </label>
            <input
              id="spouseDob"
              name="spouseDob"
              type="date"
              max={getMaxDate()}
              value={formData.spouseDob}
              onChange={onChange}
              className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-orange-200 text-slate-900 transition-all duration-300 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}