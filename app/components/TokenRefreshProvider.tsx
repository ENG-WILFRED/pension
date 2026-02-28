"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const checkAndRefreshToken = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("auth_token");
      const tokenExpiry = localStorage.getItem("token_expiry");

      if (!token || !tokenExpiry) {
        return;
      }

      const expiryTime = parseInt(tokenExpiry, 10);
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // If token has already expired
      if (timeUntilExpiry <= 0) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        toast.error("🔐 Session expired. Please login again.");
        router.push("/login");
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
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://autonest-backend.onrender.com"}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.token) {
          // Store new token and expiry time
          localStorage.setItem("auth_token", data.token);

          // Calculate expiry time (assuming 24 hours token validity)
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
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
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        router.push("/login");
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

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", throttledActivityCheck);
      window.removeEventListener("keypress", throttledActivityCheck);
      window.removeEventListener("touchstart", throttledActivityCheck);
    };
  }, [router]);

  return <>{children}</>;
}
