"use client";

import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";

const URL = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState(false);

  if (!isAuthenticated || loggedOut) return null;

  // Handles user logout
  const handleLogout = async () => {
    // Send POST request to backend to log out
    const res = await fetch(`${URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Include cookies for session
    });
    if (res.ok) {
      // On successful logout, clear local storage and redirect
      const data = await res.json();
      console.log(data);
      localStorage.removeItem("userId");
      setMenuOpen(false);
      setLoggedOut(true);
      router.push("/");
    }
  };

  return (
    <header className="fixed top-0 z-10 w-full bg-black/40 py-4 flex flex-row items-center justify-between shadow-md backdrop-blur-sm">
      <div className="w-1/3 flex items-center pl-4">
        <div className="md:text-2xl md:font-bold md:mb-2 md:text-yellow-500 md:block hidden">
          Notes Web App
        </div>
      </div>
      <nav className="flex w-1/3 gap-6 justify-center flex-1">
        <Link
          href="/notes"
          className="text-white hover:text-yellow-500 font-semibold transition"
        >
          Notes
        </Link>
        <Link
          href="/trash"
          className="text-white hover:text-yellow-500 font-semibold transition"
        >
          Trash
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-yellow-500 font-semibold transition"
        >
          About
        </Link>
      </nav>
      <div className="flex items-center justify-end w-1/3 relative">
        <button
          className="text-white mr-2 hover:text-yellow-500"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <CircleUserRound size={32} />
        </button>
      </div>
      {menuOpen && (
        <div className="absolute right-0 top-full bg-black/40 rounded shadow-lg py-2 px-4 flex flex-col min-w-[140px] z-50 backdrop-blur-sm">
          <Link
            href="/profile"
            className="text-white py-2 px-2 hover:text-yellow-500 rounded transition"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            className="text-white py-2 px-2 hover:text-red-500 rounded text-left transition"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
