// src/components/NotesSection.tsx
import { EditNoteForm } from "./EditNoteForm";
import { NewNoteForm } from "./NewNoteForm";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import { NotesSectionProps } from "@/types/notes";
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
  // Filter notes nach Ordner, wenn einer ausgewählt ist
  const filteredNotes =
    selectedFolderId === null
      ? notes
      : notes.filter((note) => note.folderId === selectedFolderId);

  return (
    <section className="relative mt-22 z-0 w-full">
      <h1 className="text-3xl font-bold text-yellow-500 mb-2 text-center">
        {title}
      </h1>
      <FolderNavbar
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        fetchFolders={fetchFolders}
      />
      <div className="flex justify-center  ">
        <button
          className="text-yellow-500 hover:text-white mt-4"
          onClick={handleAddNote}
        >
          <CirclePlus size={28} />
        </button>
      </div>
      <section className="relative z-0 min-h-screen max-w-3xl mx-auto py-4 px-4 ">
        {loading && (
          <div className="text-center text-white pt-8">Loading notes...</div>
        )}
        {error && <div className="text-center text-red-400 pt-8">{error}</div>}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col bg-gray-800 rounded-lg p-3 sm:p-4 sm:max-w-md h-70 shadow overflow-auto"
              >
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
                          onClick={() => setEditingNoteId(note.id)}
                        >
                          <Pencil size={22} />
                        </button>
                        <button
                          className="text-yellow-500 hover:text-red-600 "
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
