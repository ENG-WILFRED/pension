"use client";

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedFooter from '@/app/components/AnimatedFooter';
import { Settings, Lock, Bell, Save, Sliders } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Pension Management System',
    maintenanceMode: false,
    emailNotifications: true,
    autoLockdownHours: 24,
    defaultLoanRate: 12.5,
    maxMemberLoans: 5,
  });
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const handleToggle = (key: 'maintenanceMode' | 'emailNotifications') => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-purple-50 to-pink-100 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Configure system preferences and security options.</p>
            </div>
            <Link href="/dashboard/admin" className="text-sm text-blue-600 hover:underline">← Back to Admin</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <Settings size={32} className="text-indigo-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">General Settings</h3>
              <p className="text-xs sm:text-sm text-gray-600">System configuration</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <Lock size={32} className="text-red-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Security</h3>
              <p className="text-xs sm:text-sm text-gray-600">Access and permissions</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6">
              <Bell size={32} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Notifications</h3>
              <p className="text-xs sm:text-sm text-gray-600">Alert preferences</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sliders size={24} />
              Configuration
            </h2>

            <div className="space-y-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              {/* Auto Lockdown Hours */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-lockdown after inactivity (hours)</label>
                <input 
                  type="number" 
                  value={settings.autoLockdownHours}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoLockdownHours: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              {/* Default Loan Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default Loan Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={settings.defaultLoanRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultLoanRate: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              {/* Max Member Loans */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Loans per Member</label>
                <input 
                  type="number" 
                  value={settings.maxMemberLoans}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxMemberLoans: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900\">Maintenance Mode</p>
                  <p className="text-xs text-gray-600 mt-1">Temporarily disable user access during maintenance</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{settings.maintenanceMode ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-600 mt-1">Send alerts and reports to administrators</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{settings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleSaveSettings} 
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <button 
                  onClick={() => { 
                    setSettings({
                      siteName: 'Pension Management System',
                      maintenanceMode: false,
                      emailNotifications: true,
                      autoLockdownHours: 24,
                      defaultLoanRate: 12.5,
                      maxMemberLoans: 5,
                    }); 
                    toast('Settings reset to defaults'); 
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFooter />
    </div>
  );
}
