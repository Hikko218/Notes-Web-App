"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for registration form fields
  const [form, setForm] = useState({
    username: "",
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
    if (!form.username || !form.email || !form.password) {
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

    const res = await fetch(`${URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ username: "", email: "", password: "" });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/");
      }, 2000);
    }
    if (!res.ok) {
      setError("Registration failed!");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="mb-8">
        <Image
          src="/file.svg"
          alt="Notes Logo"
          width={64}
          height={64}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
          Create your account
        </h1>
        <p className="text-lg text-white mb-6">
          Sign up to start organizing your notes!
        </p>
      </div>
      <form
        className="bg-black/60 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 backdrop-blur-sm"
        onSubmit={handleSubmit}
      >
        <input
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          type="text"
          placeholder="Username"
          className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
        >
          Register
        </button>
        {success && (
          <div className="text-green-400 pt-2">Registration successful!</div>
        )}
        {error && <div className="text-red-400 pt-2">{error}</div>}
      </form>
      <p className="mt-6 text-white text-sm">
        Already have an account?{" "}
        <Link
          href="/"
          className="text-yellow-500 hover:text-yellow-600 font-semibold transition"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
