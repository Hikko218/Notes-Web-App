"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";
import { Trash2, ArchiveRestore } from "lucide-react";
import { motion } from "framer-motion";

const URL = process.env.NEXT_PUBLIC_API_URL;

interface Note {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

interface SavedNote {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  userId: string;
}

export default function NotesTrashPage() {
  // State for deleted notes
  const [notes, setNotes] = useState<SavedNote[]>([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error message
  const [error, setError] = useState<string | null>(null);
  // Next.js router for navigation
  const router = useRouter();

  // Get userId and authentication status from custom hook
  const { userId, isAuthenticated } = useAuth();

  // Effect: Check authentication and fetch deleted notes on mount or when auth changes
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
    // Fetch deleted notes for the user
    fetch(`${URL}/notes/deleted/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes");
        return res.json();
      })
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated, router, userId]);

  // Restore a deleted note (mark as not deleted)
  const handleRestoreNote = async (id: number) => {
    try {
      // Send PUT request to mark note as not deleted
      await fetch(`${URL}/notes/softDelete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleted: false,
        }),
      });
      // Refetch deleted notes after restoring
      const notesRes = await fetch(`${URL}/notes/deleted/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while editing.");
    }
  };

  // Permanently delete a note
  const handleDeleteNote = async (noteId: number) => {
    try {
      // Send DELETE request to remove note
      await fetch(`${URL}/notes/${noteId}`, {
        method: "DELETE",
      });
      // Refetch deleted notes after deletion
      const notesRes = await fetch(`${URL}/notes/deleted/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while deleting.");
    }
  };

  // Render deleted notes UI
  return (
    <section className="relative min-h-screen max-w-3xl mx-auto py-8 px-4 mt-16">
      {/* Page heading */}
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Deleted Notes
      </h1>
      {/* Show loading indicator */}
      {loading && (
        <div className="text-center text-white pt-8">Loading notes...</div>
      )}
      {/* Show error message */}
      {error && <div className="text-center text-red-400 pt-8">{error}</div>}

      {/* Show deleted notes when not loading */}
      {!loading && (
        <div className="space-y-4 grid md:grid-cols-2 gap-6">
          {notes.map((note: Note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex flex-col bg-gray-800/70 rounded-lg p-4 max-w-90 h-70 shadow overflow-auto"
            >
              {/* Note title */}
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                {note.title}
              </h2>
              {/* Note content */}
              <p className="text-white mb-2 whitespace-pre-line">
                {note.content}
              </p>
              <div className="flex-grow"></div>
              <div className="flex justify-between">
                {/* Last updated info */}
                <div className="text-xs text-gray-400 ">
                  Last updated:{" "}
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleString()
                    : "-"}
                </div>

                {/* Restore and delete buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    className="text-yellow-500 hover:text-white "
                    onClick={() => handleRestoreNote(note.id)}
                  >
                    <ArchiveRestore size={22} />
                  </button>
                  <button
                    className="text-yellow-500 hover:text-red-600 "
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
