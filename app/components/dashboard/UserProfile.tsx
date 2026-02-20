interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  nationalId?: string;
  createdAt?: string;
  accountNumber?: string;
}

interface UserProfileProps {
  user: User | null;
  onOpenSettings?: () => void;
}

export default function UserProfile({ user, onOpenSettings }: UserProfileProps) {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-600 dark:via-orange-700 dark:to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-orange-100 dark:ring-orange-900/30 transition-all duration-300">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{user?.firstName} {user?.lastName}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{user?.email}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 transition-colors duration-300">Member Since: {formatDate(user?.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSettings?.()}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Account Settings
            </button>
            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold shadow-sm transition-colors duration-300">Active</span>
          </div>
        </div>
      </div>

      <div className="relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 transition-colors duration-300">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            Key Information
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">ID Number:</span>
              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{user?.nationalId}</p>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">Mobile:</span>
              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{user?.phone || 'N/A'}</p>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">AutoNest ID:</span>
              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {user?.accountNumber ? String(user.accountNumber).padStart(8, '0') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}