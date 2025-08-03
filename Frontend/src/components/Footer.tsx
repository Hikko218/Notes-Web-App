"use client";
import { useAuth } from "@/components/useAuthStatus";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <footer className="flex gap-[24px] flex-wrap items-center justify-center bg-black/40 backdrop-blur-sm ">
      {/* Copyright and author info */}
      <a className="flex items-center gap-2 text-secondary">
        <span className="text-2xl text-secondary">{"\u00AE"}</span> H.Ries
      </a>
    </footer>
  );
}
