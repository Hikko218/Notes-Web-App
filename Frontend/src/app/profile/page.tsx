"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";
import { motion } from "framer-motion";

const URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  // State for success message
  const [success, setSuccess] = useState<string | null>(null);
  // State for error message
  const [error, setError] = useState<string | null>(null);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // Next.js router for navigation
  const router = useRouter();

  // Get userId and authentication status from custom hook
  const { userId, isAuthenticated } = useAuth();

  // Effect: Check authentication and fetch user data on mount or when auth changes
  useEffect(() => {
    // If authentication status is not determined, show loading
    if (isAuthenticated === null || isAuthenticated === undefined) {
      setLoading(true);
      return;
    }
    // If not authenticated, redirect to home page
    if (isAuthenticated === false) {
      router.push("/");
      return;
    }
    // If authenticated, fetch user data
    if (isAuthenticated === true) {
      setLoading(false);
      fetch(`${URL}/user/id/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            username: data.username ?? "",
            email: data.email ?? "",
          }));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      return;
    }
  }, [isAuthenticated, router, userId]);

  // State for form fields (username, email, password, repeat password)
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    validatePassword: "",
  });

  // Handles input changes for form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles user credential change and form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all required fields
    if (!form.email || !form.password || !form.validatePassword) {
      setError("All fields are required!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate password length
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate passwords match
    if (form.password !== form.validatePassword) {
      setError("Passwords do not match.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Prepare data and send PUT request to update user credentials
    const { username, email, password } = form;
    const res = await fetch(`${URL}/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (res.ok) {
      setForm({ username: "", email: "", password: "", validatePassword: "" });
      setSuccess("Credentials updated!");
      setTimeout(() => {
        setSuccess(null);
        router.push("/notes");
      }, 2000);
    }
    if (!res.ok) {
      setError("Registration failed!");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Handles user account deletion
  const handleDeleteUser = async (userId: number) => {
    // Require password for deletion
    if (!form.password) {
      setError("Password is required for deletion.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    // Validate password length
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    // Validate password with backend
    const validateRes = await fetch(`${URL}/auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const validateData = await validateRes.json();
    if (!validateRes.ok || !validateData.valid) {
      setError("Password incorrect. Account not deleted.");
      setTimeout(() => setError(null), 4000);
      return;
    }
    // Send DELETE request to remove user
    const deleteRes = await fetch(`${URL}/user/${userId}`, {
      method: "DELETE",
    });
    if (deleteRes.ok) {
      // Logout after successful deletion
      await fetch(`${URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("userId");
      setSuccess("User deleted!");
      setTimeout(() => {
        setSuccess(null);
        router.push("/");
      }, 2000);
    } else {
      setError("Account deletion failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Render profile update and delete UI
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
      {/* Animated container for profile section */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center"
      >
        {/* Show loading indicator */}
        {loading && (
          <div className="text-center text-white pt-8">Loading...</div>
        )}
        {/* Show error message */}
        {error && <div className="text-center text-red-400 pt-8">{error}</div>}
        {/* Logo and heading */}
        <div className="mb-8">
          <Image
            src="/file.svg"
            alt="Notes Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
            Update your account
          </h1>
        </div>
        {/* Instructions for updating and deleting account */}
        <div className="max-w-md w-full mx-auto mb-4">
          <p className="text-base text-white mb-2">
            Update your username, email or password below.
            <br />
            To delete your account, please enter your password and click{" "}
            <span className="font-semibold text-red-400">Delete Account</span>.
            <br />
            <span className="text-gray-400 text-sm">
              Password must be at least 8 characters.
            </span>
          </p>
        </div>
        {/* Form for updating credentials and deleting account */}
        <form
          className="bg-black/60 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 backdrop-blur-sm"
          onSubmit={handleSubmit}
        >
          {/* Username input */}
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            type="username"
            placeholder="Username"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Email input */}
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Password input */}
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Repeat password input */}
          <input
            id="validatePassword"
            name="validatePassword"
            value={form.validatePassword}
            onChange={handleChange}
            type="password"
            placeholder="Repeat Password"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {/* Submit button for updating credentials */}
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
          >
            Submit
          </button>
          {/* Delete account button */}
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
            onClick={() => handleDeleteUser(Number(userId))}
          >
            Delete Account
          </button>
          {/* Show success message */}
          {success && <div className="text-green-400 pt-2">{success}</div>}
          {/* Show error message */}
          {error && <div className="text-red-400 pt-2">{error}</div>}
        </form>
      </motion.div>
    </section>
  );
}
