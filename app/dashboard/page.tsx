///home/hp/JERE/pension/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user) {
          toast.error('Please login to continue');
          router.replace('/login');
          return;
        }

        // Check user role and redirect accordingly
        if (user.role === 'admin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard/customer');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        toast.error('Session expired. Please login again.');
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    };

    checkUserRole();
  }, [router]);

  if (checking) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-700 font-medium">Checking your access...</p>
      </div>
    );
  }

  return null;
}