"use client";
// src/components/NotesSection.tsx
import { EditNoteForm } from "./EditNoteForm";
import { NewNoteForm } from "./NewNoteForm";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import { NotesSectionProps } from "@/types/notes";
import { motion } from "framer-motion";
import { useState } from "react";
import { FolderNavbar } from "./FolderNavbar";

export function NotesSection({
  notes,
  fetchFolders,
  folders = [],
  selectedFolderId,
  setSelectedFolderId,
  loading,
  error,
  showNewNote,
  newTitle,
  newContent,
  saving,
  editingNoteId,
  handleAddNote,
  handleSaveNote,
  handleEditSave,
  handleDeleteNote,
  setNewTitle,
  setNewContent,
  setShowNewNote,
  setEditingNoteId,
  title = "Your Notes",
}: NotesSectionProps) {
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter notes by selected folder
  const folderFilteredNotes =
    selectedFolderId === null
      ? notes
      : notes.filter((note) => note.folderId === selectedFolderId);

  // Filter notes by search term (applies to displayed notes only)
  const filteredNotes =
    searchTerm.trim() === ""
      ? folderFilteredNotes
      : folderFilteredNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <section className="relative mt-22 z-0 w-full">
      {/* Page heading */}
      <h1 className="text-3xl font-bold text-yellow-500 mb-2 text-center">
        {title}
      </h1>
      {/* Folder navigation bar */}
      <FolderNavbar
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        fetchFolders={fetchFolders}
      />
      {/* Search input and add note button */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-2 max-w-70 px-2 py-1 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          className="fixed bottom-10 right-10 text-white hover:text-yellow-500 z-10"
          onClick={handleAddNote}
        >
          <CirclePlus size={36} />
        </button>
      </div>
      {/* Notes grid and forms */}
      <section className="relative z-0 min-h-screen max-w-3xl mx-auto py-4 px-4 ">
        {loading && (
          <div className="text-center text-white pt-8">Loading notes...</div>
        )}
        {error && <div className="text-center text-red-400 pt-8">{error}</div>}

        {/* Show notes grid when not loading */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New note form */}
            {showNewNote && (
              <NewNoteForm
                title={newTitle}
                content={newContent}
                onTitleChange={setNewTitle}
                onContentChange={setNewContent}
                onSave={handleSaveNote}
                onCancel={() => setShowNewNote(false)}
                saving={saving}
              />
            )}

            {/* Render filtered notes */}
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col bg-gray-800/70 rounded-lg p-3 sm:p-4 sm:max-w-md h-70 shadow overflow-auto"
              >
                {/* Edit note form if editing */}
                {editingNoteId === note.id ? (
                  <EditNoteForm
                    initialTitle={note.title}
                    initialContent={note.content}
                    saving={saving}
                    onSave={(title, content) =>
                      handleEditSave(note.id, title, content)
                    }
                    onCancel={() => setEditingNoteId(null)}
                  />
                ) : (
                  <>
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
                      {/* Edit and delete buttons */}
                      <div className="flex justify-end gap-3">
                        <button
                          className="text-white hover:text-yellow-500 "
                          onClick={() => setEditingNoteId(note.id)}
                        >
                          <Pencil size={22} />
                        </button>
                        <button
                          className="text-white hover:text-red-600 "
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
