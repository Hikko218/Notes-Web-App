"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";
import { Trash2, ArchiveRestore } from "lucide-react";


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
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null || isAuthenticated === undefined) {
      setLoading(true);
      return;
    }
    if (isAuthenticated === false) {
      router.push("/");
      return;
    }
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



// Handle restore note
  const handleRestoreNote = async (id: number) => {
    try {
      await fetch(`${URL}/notes/softDelete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleted: false,
        }),
      });
      // Refetch notes
      const notesRes = await fetch(`${URL}/notes/deleted/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while editing.");
    } 
  };

  // Handle soft delete note
  const handleDeleteNote = async (noteId: number) => {
    try {
      await fetch(`${URL}/notes/${noteId}`, {
        method: "DELETE",
      });
      // Refetch notes
      const notesRes = await fetch(`${URL}/notes/deleted/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while deleting.");
    }
  };

  return (
    <section className="relative min-h-screen max-w-3xl mx-auto py-8 px-4 mt-16">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Deleted Notes
      </h1>
      {loading && (
        <div className="text-center text-white pt-8">Loading notes...</div>
      )}
      {error && <div className="text-center text-red-400 pt-8">{error}</div>}

      {!loading && (
        <div className="space-y-4 grid md:grid-cols-2 gap-6">
          {notes.map((note: Note) => (
            <div
              key={note.id}
              className="flex flex-col bg-gray-800 rounded-lg p-4 max-w-90 h-70 shadow overflow-auto"
            >
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                {note.title}
              </h2>
              <p className="text-white mb-2 whitespace-pre-line">
                {note.content}
              </p>
              <div className="flex-grow"></div>
              <div className="flex justify-between">
                <div className="text-xs text-gray-400 ">
                  Last updated:{" "}
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleString()
                    : "-"}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="text-yellow-500 hover:text-white "
                    onClick={() => handleRestoreNote(note.id)}
                  >
                    <ArchiveRestore size={22} />{" "}
                  </button>
                  <button
                    className="text-yellow-500 hover:text-red-600 "
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 size={22} />{" "}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
