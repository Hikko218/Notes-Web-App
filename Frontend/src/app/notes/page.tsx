"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";
import { CirclePlus } from "lucide-react";

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

export default function NotesPage() {
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewNote, setShowNewNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }
    fetch(`${URL}/notes/user/${userId}`)
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
  }, [userId]);

  const handleAddNote = () => {
    setShowNewNote(true);
    setNewTitle("");
    setNewContent("");
  };

  const handleSaveNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          userId: Number(userId),
          deleted: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      const notesRes = await fetch(`${URL}/notes/user/${userId}`);
      if (!notesRes.ok) throw new Error("Failed to fetch notes after save");
      const notesData = await notesRes.json();
      setNotes(notesData);
      setShowNewNote(false);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setTimeout(() => setError(null), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="relative min-h-screen max-w-3xl mx-auto py-8 px-4 mt-16">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Your Notes
      </h1>
      {loading && (
        <div className="text-center text-white pt-8">Loading notes...</div>
      )}
      {error && <div className="text-center text-red-400 pt-8">{error}</div>}
      {showNewNote && (
        <div className="bg-black/60 max-w-90 rounded-lg p-4 mb-4 shadow">
          <input
            className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-yellow-400 placeholder-gray-500"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={saving}
          />
          <textarea
            className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-white placeholder-gray-500"
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            disabled={saving}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              onClick={handleSaveNote}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-800"
              onClick={() => setShowNewNote(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!loading &&
        !error &&
        (notes.length === 0 ? (
          <div className="text-white text-center">No notes found.</div>
        ) : (
          <div className="space-y-4 grid grid-cols-2 gap-6">
            {notes.map((note: Note) => (
              <div
                key={note.id}
                className="bg-gray-800 rounded-lg p-4 max-w-90 h-50 shadow"
              >
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                  {note.title}
                </h2>
                <p className="text-white mb-2">{note.content}</p>
                <div className="text-xs text-gray-400 ">
                  Last updated:{" "}
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        ))}
      <button
        className="text-yellow-500 hover:text-yellow-600 mt-6"
        onClick={handleAddNote}
      >
        <CirclePlus size={46} />{" "}
      </button>
    </section>
  );
}
