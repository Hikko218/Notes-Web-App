"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* About me */}
      <motion.section
        className="max-w-xl w-full  rounded-lg p-8 mb-8 "
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-yellow-500 mb-4 text-center">
          About Me
        </h1>
        <p className="text-white text-lg mb-2 text-center">
          Hi, I&apos;m Heiko!
          <br />
          I&apos;m passionate about developing web applications and always eager
          to learn more.
        </p>
        <p className="text-white text-center mb-2">
          This website was created as a learning project to deepen my practical
          knowledge of modern web technologies like React, Next.js, Tailwind,
          and NestJS.
        </p>
        <p className="text-white text-center">
          <span className="font-semibold text-yellow-400">Learning Goals:</span>{" "}
          <br />
          - Fullstack development with TypeScript
          <br />
          - Authentication and security
          <br />
          - Responsive UI/UX with Tailwind
          <br />- Database integration with Prisma
        </p>
      </motion.section>
      {/* Links & Contact */}
      <motion.section
        className="max-w-xl w-full  rounded-lg  p-6 mb-8 "
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-3 text-center">
          Links & Contact
        </h2>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="https://github.com/Hikko218"
            target="_blank"
            className="text-white hover:text-yellow-500 font-semibold underline"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/heiko-ries-b35778374"
            target="_blank"
            className="text-white hover:text-yellow-500 font-semibold underline"
          >
            LinkedIn
          </Link>
        </div>
      </motion.section>
      {/* Other */}
      <motion.section
        className="max-w-xl w-full  rounded-lg  p-6 "
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-yellow-500 mb-2 text-center">
          Other
        </h2>
        <p className="text-white text-center">
          This app is open source and can be extended.
          <br />
          Feedback, ideas, or pull requests are always welcome!
        </p>
      </motion.section>
    </main>
  );
}
