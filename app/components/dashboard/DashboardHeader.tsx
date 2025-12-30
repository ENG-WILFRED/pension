///home/hp/JERE/AutoNest/app/components/dashboard/DashboardHeader.tsx
"use client";

import { Shield } from 'lucide-react';

interface DashboardHeaderProps {
  firstName?: string;
  lastName?: string;
  userType?: 'customer' | 'admin';
}

export default function DashboardHeader({ firstName, lastName, userType = 'customer' }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm w-full">
      <div className="w-full flex items-center justify-between py-4 px-4 lg:px-8">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-900">
            {userType === 'admin' ? 'Admin Dashboard' : 'AutoNest Dashboard'}
          </h1>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            Welcome back, {firstName} {lastName}
            {userType === 'admin' && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                <Shield size={12} />
                Administrator
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Display */}
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}