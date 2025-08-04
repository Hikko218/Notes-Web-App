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
  // State for storing folders
  const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);
  // State for currently selected folder
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  // State for storing notes
  const [notes, setNotes] = useState<SavedNote[]>([]);
  // Loading state for async operations
  const [loading, setLoading] = useState(true);
  // Error state for displaying errors
  const [error, setError] = useState<string | null>(null);
  // State to show/hide new note form
  const [showNewNote, setShowNewNote] = useState(false);
  // State for new note title
  const [newTitle, setNewTitle] = useState("");
  // State for new note content
  const [newContent, setNewContent] = useState("");
  // State to indicate saving in progress
  const [saving, setSaving] = useState(false);
  // State for currently editing note id
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  // Next.js router for navigation
  const router = useRouter();

  // Get userId and authentication status from custom hook
  const { userId, isAuthenticated } = useAuth();

  // Fetch folders for the current user
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

  // Effect: Check authentication and fetch notes & folders on mount or when auth changes
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
    // Fetch notes for the user
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
    // Fetch folders for the user
    fetchFolders();
  }, [isAuthenticated, router, userId, fetchFolders]);

  // Show new note input form and reset fields
  const handleAddNote = () => {
    setShowNewNote(true);
    setNewTitle("");
    setNewContent("");
  };

  // Save a new note to the backend
  const handleSaveNote = async () => {
    // Prevent saving if both title and content are empty
    if (!newTitle.trim() && !newContent.trim()) return;
    setSaving(true);
    try {
      // Prepare note data
      const body: Partial<SavedNote> = {
        title: newTitle,
        content: newContent,
        userId: Number(userId),
        deleted: false,
      };
      // Add folderId if a folder is selected
      if (selectedFolderId !== null) {
        body.folderId = selectedFolderId;
      }
      // Send POST request to create note
      const res = await fetch(`${URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // Reload notes after saving
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

  // Save edits to an existing note
  const handleEditSave = async (id: number, title: string, content: string) => {
    setSaving(true);
    try {
      // Send PUT request to update note
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
      // Refetch notes after editing
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

  // Soft delete a note (mark as deleted)
  const handleDeleteNote = async (noteId: number) => {
    try {
      // Send PUT request to mark note as deleted
      await fetch(`${URL}/notes/softDelete/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleted: true,
        }),
      });
      // Refetch notes after deletion
      const notesRes = await fetch(`${URL}/notes/user/${userId}`);
      const notesData = await notesRes.json();
      setNotes(notesData);
    } catch {
      setError("An error occurred while deleting.");
    }
  };

  // Render NotesSection component with all props and handlers
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
