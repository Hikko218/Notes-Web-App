"use client";
// Import authentication hook
import { useAuth } from "@/components/useAuthStatus";

// Footer component
export default function Footer() {
  // Get authentication status
  const { isAuthenticated } = useAuth();

  // Only show footer if user is authenticated
  if (!isAuthenticated) return null;

  // Render footer with copyright and author info
  return (
    <footer className="flex gap-[24px] flex-wrap items-center justify-center bg-black/40 backdrop-blur-sm ">
      {/* Copyright and author info */}
      <a className="flex items-center gap-2 text-secondary">
        <span className="text-2xl text-secondary">{"\u00AE"}</span> H.Ries
      </a>
    </footer>
  );
}
