// Import React hooks
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// API base URL
const URL = process.env.NEXT_PUBLIC_API_URL;

// Custom hook to check authentication status and get userId
export function useAuth() {
  // State for userId
  const [userId, setUserId] = useState<string | null>();
  // State for authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // Get current pathname for re-checking on route change
  const pathname = usePathname();

  useEffect(() => {
    // Function to check authentication status from backend
    async function checkAuth() {
      try {
        // Send GET request to check auth status
        const res = await fetch(`${URL}/auth/status`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          // If authenticated, set states and store userId
          const data = await res.json();
          setIsAuthenticated(data.isAuthenticated);
          setUserId(data.userId || null);
          localStorage.setItem("userId", data.userId);
        } else {
          // If not authenticated, clear states and local storage
          setIsAuthenticated(false);
          setUserId(null);
          localStorage.removeItem("userId");
        }
      } catch {
        // On error, clear states and local storage
        setIsAuthenticated(false);
        setUserId(null);
        localStorage.removeItem("userId");
      }
    }
    // Run authentication check on mount and when pathname changes
    checkAuth();
  }, [pathname]);

  // Return userId and authentication status
  return { userId, isAuthenticated };
}
