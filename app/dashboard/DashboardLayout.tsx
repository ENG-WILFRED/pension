///home/hp/JERE/AutoNest/app/dashboard/DashboardLayout.tsx
"use client";

// THIS COMPONENT IS NO LONGER NEEDED - layout.tsx handles everything
// Keep it for backwards compatibility but it just renders children

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "customer" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Just render children - the actual layout is handled by layout.tsx
  return <>{children}</>;
}