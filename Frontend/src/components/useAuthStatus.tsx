import { useState, useEffect } from "react";

export function useAuth() {
  const [userId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userId") : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    !!userId
  );

  useEffect(() => {
    // Falls sich localStorage im Laufzeitbetrieb ändert, kann hier nachgerüstet werden
    setIsAuthenticated(!!userId);
  }, [userId]);

  return { userId, isAuthenticated };
}
