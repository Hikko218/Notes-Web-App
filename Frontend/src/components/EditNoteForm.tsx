// Import React and useState hook
import React, { useState } from "react";

// Props for the EditNoteForm component
interface EditNoteFormProps {
  initialTitle: string; // Initial note title
  initialContent: string; // Initial note content
  onSave: (title: string, content: string) => void; // Save handler
  onCancel: () => void; // Cancel handler
  saving: boolean; // Saving state
}

// EditNoteForm component for editing a note's title and content
export const EditNoteForm: React.FC<EditNoteFormProps> = ({
  initialTitle,
  initialContent,
  onSave,
  onCancel,
  saving,
}) => {
  // State for note title
  const [title, setTitle] = useState(initialTitle);
  // State for note content
  const [content, setContent] = useState(initialContent);
  return (
    <div className="flex flex-col bg-black/60 max-w-90 h-70 rounded-lg p-4 mb-4 shadow">
      {/* Title input field */}
      <input
        className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-yellow-400 placeholder-gray-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={saving}
      />
      {/* Content textarea field */}
      <textarea
        className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-white placeholder-gray-500"
        placeholder="Content"
        value={content}
        rows={4}
        onChange={(e) => setContent(e.target.value)}
        disabled={saving}
      />
      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        {/* Save button */}
        <button
          className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          onClick={() => onSave(title, content)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {/* Cancel button */}
        <button
          className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-800"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
