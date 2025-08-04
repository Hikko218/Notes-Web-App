"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const URL = process.env.NEXT_PUBLIC_API_URL;

export default function HeroLogin() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for registration form fields
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Call router
  const router = useRouter();

  // Handles input changes for registration fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles  user registration and form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if all fields are completed
    if (!form.email || !form.password) {
      setError("All fields are required!");
      setTimeout(() => setError(null), 3000);
      return;
    }
    // Check if email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const res = await fetch(`${URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("userId", data.userId);
      setForm({ email: "", password: "" });
      setSuccess(true);
      router.push("/notes");
      setTimeout(() => setSuccess(false), 2000);
    }
    if (!res.ok) {
      setError("Login failed!");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <section className="relative flex flex-col items-center  justify-center min-h-screen text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center"
      >
        <div className="mb-8">
          <Image
            src="/file.svg"
            alt="Notes Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
            Welcome to Notes Web App
          </h1>
          <p className="text-lg text-white mb-6">
            Organize your thoughts, ideas and tasks in one place.
          </p>
        </div>
        {/* Login form */}
        <form
          className="bg-black/60 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 backdrop-blur-sm"
          onSubmit={handleSubmit}
        >
          {/* Email input field */}
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Password input field */}
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Login button */}
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
          {/* Show success message */}
          {success && (
            <div className="text-green-400 pt-2">Login successful!</div>
          )}
          {/* Show error message */}
          {error && <div className="text-red-400 pt-2">{error}</div>}
        </form>
        <p className="mt-6 text-white text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-yellow-500 hover:text-yellow-600 font-semibold transition"
          >
            Sing up
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
