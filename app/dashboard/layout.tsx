///app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AnimatedFooter from "../components/AnimatedFooter";
import TokenRefreshProvider from "../components/TokenRefreshProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    firstName?: string;
    lastName?: string;
    role?: "customer" | "admin";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("auth_token");

        console.log('[DASHBOARD] Checking auth:', {
          hasUserStr: !!userStr,
          hasToken: !!token,
          userStrLength: userStr?.length
        });

        // If no token, redirect immediately
        if (!token) {
          console.log('[DASHBOARD] No auth token found, redirecting to login');
          localStorage.clear(); // Clear everything
          toast.error("Please login to continue");
          router.push("/login");
          return;
        }

        // Parse user data
        let storedUser = null;
        if (userStr) {
          try {
            storedUser = JSON.parse(userStr);
            console.log('[DASHBOARD] Parsed user:', {
              hasId: !!storedUser?.id,
              hasUserId: !!storedUser?.userId,
              email: storedUser?.email,
              role: storedUser?.role
            });
          } catch (parseError) {
            console.error('[DASHBOARD] Failed to parse user data:', parseError);
            localStorage.removeItem('user');
            toast.error("Session data corrupted. Please login again.");
            router.push("/login");
            return;
          }
        }

        // Check for user ID (try multiple fields)
        const userId = storedUser?.id || storedUser?.userId || storedUser?.email;

        if (!userId) {
          console.error('[DASHBOARD] No user identifier found, redirecting to login');
          // Clear corrupted auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('user');
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        // Ensure user has required fields
        const userWithDefaults = {
          ...storedUser,
          id: userId, // Ensure id is set
          role: storedUser?.role || 'customer' // Default role
        };

        setUser(userWithDefaults);
        setLoading(false);
      } catch (error) {
        console.error('[DASHBOARD] Auth check error:', error);
        localStorage.clear();
        toast.error("Authentication error. Please login again.");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Determine user type from pathname
  const userType = pathname?.includes("/admin") ? "admin" : "customer";

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="h-12 w-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 dark:text-indigo-300 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <TokenRefreshProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 transition-colors duration-300">
        {/* Sidebar - Fixed on desktop, slides in/out on mobile */}
        <Sidebar
          userType={userType}
          firstName={user?.firstName}
          lastName={user?.lastName}
        />

        {/* Main Content Area - Add left margin to account for fixed sidebar on desktop */}
        <div className="lg:ml-64 min-h-screen flex flex-col">
          {/* Header */}
          <DashboardHeader
            firstName={user?.firstName}
            lastName={user?.lastName}
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
    </TokenRefreshProvider>
  );
}