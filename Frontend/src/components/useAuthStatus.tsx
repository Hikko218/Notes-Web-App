import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const [userId, setUserId] = useState<string | null>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${URL}/auth/status`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.isAuthenticated);
          setUserId(data.userId || null);
          localStorage.setItem("userId", data.userId);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          localStorage.removeItem("userId");
        }
      } catch {
        setIsAuthenticated(false);
        setUserId(null);
        localStorage.removeItem("userId");
      }
    }
    checkAuth();
  }, [pathname]);

  return { userId, isAuthenticated };
}
