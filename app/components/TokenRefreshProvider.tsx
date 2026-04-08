"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setSessionExpiredHandler } from "../lib/api-client";

interface TokenRefreshProps {
  children: React.ReactNode;
}

const TOKEN_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
const TOKEN_CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

export default function TokenRefreshProvider({ children }: TokenRefreshProps) {
  const router = useRouter();
  const warningShownRef = useRef(false);
  const refreshInProgressRef = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Register the session expiration handler
    setSessionExpiredHandler(() => {
      console.log("[SESSION] Expiration detected, redirecting to login");
      toast.error("🔐 Session expired. Please login again.");
      
      // Immediate redirect - no delay
      if (typeof window !== 'undefined') {
        console.log('[SESSION] Redirecting immediately via window.location');
        // Force a full page reload to ensure redirect works
        window.location.replace('/login');
      }
    });

    // Check token expiry immediately on mount
    const checkTokenOnMount = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("auth_token");
      const tokenExpiry = localStorage.getItem("token_expiry");

      if (!token || !tokenExpiry) {
        return;
      }

      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      console.log('[MOUNT_CHECK] Token expiry check on mount');
      console.log('[MOUNT_CHECK] Time until expiry:', timeUntilExpiry, 'ms');

      // If token has already expired
      if (timeUntilExpiry <= 0) {
        console.log('[MOUNT_CHECK] Token expired on mount, redirecting');
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        toast.error("🔐 Session expired. Please login again.");
        
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
        return;
      }
    };

    checkTokenOnMount();

    // Add global test function for debugging
    if (typeof window !== 'undefined') {
      (window as any).testSessionExpiry = () => {
        console.log('[TEST] Manually triggering session expiry');
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        toast.error("🔐 Session expired. Please login again.");
        
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            console.log('[TEST] Redirecting to /login');
            window.location.replace('/login');
          }
        }, 100);
      };
    }
  }, [router]);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      console.log('[TOKEN_CHECK] Running periodic token check');
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("auth_token");
      const tokenExpiry = localStorage.getItem("token_expiry");

      console.log('[TOKEN_CHECK] Token exists:', !!token, 'Expiry exists:', !!tokenExpiry);

      if (!token || !tokenExpiry) {
        console.log('[TOKEN_CHECK] No token or expiry, skipping');
        return;
      }

      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      console.log('[TOKEN_CHECK] Expiry time:', new Date(expiryTime).toLocaleString());
      console.log('[TOKEN_CHECK] Current time:', new Date(currentTime).toLocaleString());
      console.log('[TOKEN_CHECK] Time until expiry:', timeUntilExpiry, 'ms (', Math.ceil(timeUntilExpiry / 1000 / 60), 'minutes)');

      // If token has already expired
      if (timeUntilExpiry <= 0) {
        console.log('[TOKEN_CHECK] Token has expired, clearing auth data and redirecting');
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        toast.error("🔐 Session expired. Please login again.");
        
        // Immediate redirect
        if (typeof window !== 'undefined') {
          console.log('[TOKEN_CHECK] Redirecting immediately via window.location.replace');
          window.location.replace('/login');
        }
        warningShownRef.current = false;
        return;
      }

      // If token is about to expire (within 5 minutes) and we haven't shown warning yet
      if (
        timeUntilExpiry <= TOKEN_WARNING_TIME &&
        !warningShownRef.current &&
        timeUntilExpiry > 0
      ) {
        warningShownRef.current = true;

        // Show toast with action to refresh
        toast.info(
          `⏰ Your session will expire in ${Math.ceil(
            timeUntilExpiry / 1000 / 60
          )} minutes`,
          {
            duration: 60000,
            action: {
              label: "Extend Session",
              onClick: () => {
                refreshToken();
              },
            },
          }
        );
      }
    };

    const refreshToken = async () => {
      if (refreshInProgressRef.current) return;

      refreshInProgressRef.current = true;
      setIsRefreshing(true);

      try {
        const refreshTokenValue = localStorage.getItem("refresh_token");
        if (!refreshTokenValue) {
          throw new Error("No refresh token found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://autonest-backend.onrender.com"}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
          }
        );

        const data = await response.json();

        if (data.success && (data.data?.accessToken || data.accessToken)) {
          // Store new tokens
          const newAccessToken = data.data?.accessToken || data.accessToken;
          const newRefreshToken = data.data?.refreshToken || data.refreshToken;
          
          localStorage.setItem("auth_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          // Calculate expiry time (15 minutes for access token)
          const expiryTime = Date.now() + 15 * 60 * 1000;
          localStorage.setItem("token_expiry", expiryTime.toString());

          // Reset warning flag so it can show again
          warningShownRef.current = false;

          toast.success("✅ Session extended successfully!");
        } else {
          throw new Error(data.error || "Failed to refresh token");
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        toast.error("❌ Failed to extend session. Please login again.");
        // Clear auth data on refresh failure
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        
        // Immediate redirect
        if (typeof window !== 'undefined') {
          console.log('[REFRESH_ERROR] Redirecting immediately via window.location.replace');
          window.location.replace('/login');
        }
      } finally {
        refreshInProgressRef.current = false;
        setIsRefreshing(false);
      }
    };

    // Set up interval to check token expiry periodically
    const interval = setInterval(checkAndRefreshToken, TOKEN_CHECK_INTERVAL);

    // Check immediately on mount
    checkAndRefreshToken();

    // Also check on user activity (mouse move, key press, touch)
    const handleUserActivity = () => {
      checkAndRefreshToken();
    };

    // Throttle activity checks to once per minute
    let lastActivityCheck = 0;
    const throttledActivityCheck = () => {
      const now = Date.now();
      if (now - lastActivityCheck > 60000) {
        lastActivityCheck = now;
        handleUserActivity();
      }
    };

    window.addEventListener("mousemove", throttledActivityCheck);
    window.addEventListener("keypress", throttledActivityCheck);
    window.addEventListener("touchstart", throttledActivityCheck);
    
    // Also check when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[VISIBILITY] Page became visible, checking token');
        checkAndRefreshToken();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", throttledActivityCheck);
      window.removeEventListener("keypress", throttledActivityCheck);
      window.removeEventListener("touchstart", throttledActivityCheck);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return <>{children}</>;
}
