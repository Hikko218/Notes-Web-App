"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuthStatus";
import { NotesSection } from "@/components/NotesSection";

const URL = process.env.NEXT_PUBLIC_API_URL;

interface SavedNote {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  userId: number;
  folderId: number;
  deleted: boolean;
}

export default function NotesPage() {
  const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewNote, setShowNewNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const router = useRouter();

  const { userId, isAuthenticated } = useAuth();

  // Folder-Fetch Funktion für Wiederverwendung
  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch(`${URL}/folder/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [userId]);

  // Check if authenticated and fetch notes & folders
  useEffect(() => {
    if (isAuthenticated === null || isAuthenticated === undefined) {
      setLoading(true);
      return;
    }
    if (isAuthenticated === false) {
      router.push("/");
      return;
    }
    // Fetch notes
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
    // Fetch folders
    fetchFolders();
  }, [isAuthenticated, router, userId, fetchFolders]);

  // Handle add notes input
  const handleAddNote = () => {
    setShowNewNote(true);
    setNewTitle("");
    setNewContent("");
  };

  // Handle safe notes
  const handleSaveNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    setSaving(true);
    try {
      const body: Partial<SavedNote> = {
        title: newTitle,
        content: newContent,
        userId: Number(userId),
        deleted: false,
      };
      if (selectedFolderId !== null) {
        body.folderId = selectedFolderId;
      }

      const res = await fetch(`${URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const notesRes = await fetch(`${URL}/notes/user/${userId}`);
        if (notesRes.ok) {
          setNotes(await notesRes.json());
          setShowNewNote(false);
          setNewTitle("");
          setNewContent("");
        } else {
          setError("Failed to fetch notes after save");
        }
      } else {
        setError("Failed to save note");
      }
    } catch {
      setError("An error occurred while saving.");
    }
    setSaving(false);
  };

  // Handle edit delete note
  const handleEditSave = async (id: number, title: string, content: string) => {
    setSaving(true);
    try {
      await fetch(`${URL}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          userId: Number(userId),
          deleted: false,
        }),
      });
      // Refetch notes
      const notesRes = await fetch(`${URL}/notes/user/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
      setEditingNoteId(null);
    } catch {
      setError("An error occurred while editing.");
    } finally {
      setSaving(false);
    }
  };

  // Handle soft delete note
  const handleDeleteNote = async (noteId: number) => {
    try {
      await fetch(`${URL}/notes/softDelete/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleted: true,
        }),
      });
      // Refetch notes
      const notesRes = await fetch(`${URL}/notes/user/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while deleting.");
    }
  };

  return (
    <NotesSection
      notes={notes}
      folders={folders}
      selectedFolderId={selectedFolderId}
      setSelectedFolderId={setSelectedFolderId}
      loading={loading}
      error={error}
      showNewNote={showNewNote}
      newTitle={newTitle}
      newContent={newContent}
      saving={saving}
      editingNoteId={editingNoteId}
      handleAddNote={handleAddNote}
      handleSaveNote={handleSaveNote}
      handleEditSave={handleEditSave}
      handleDeleteNote={handleDeleteNote}
      setNewTitle={setNewTitle}
      setNewContent={setNewContent}
      setShowNewNote={setShowNewNote}
      setEditingNoteId={setEditingNoteId}
      fetchFolders={fetchFolders}
      title="Your Notes"
    />
  );
}
