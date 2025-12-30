///home/hp/JERE/AutoNest/app/dashboard/DashboardLayout.tsx
"use client";

import Sidebar from "./Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AnimatedFooter from "../components/AnimatedFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "customer" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function DashboardLayout({
  children,
  userType,
  firstName,
  lastName,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Sidebar - Fixed on desktop */}
      <Sidebar userType={userType} firstName={firstName} lastName={lastName} />

      {/* Main Content Area - Add left margin to account for fixed sidebar on desktop */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <DashboardHeader
          firstName={firstName}
          lastName={lastName}
          userType={userType}
        />

        {/* Scrollable Content */}
        <main className="flex-1">
          <div className="pb-20">{children}</div>
        </main>

        {/* Footer */}
        <AnimatedFooter />
      </div>
    </div>
  );
}