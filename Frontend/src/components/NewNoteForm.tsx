// Import React and motion for animation
import React from "react";
import { motion } from "framer-motion";

// Props for the NewNoteForm component
interface NewNoteFormProps {
  title: string; // Note title input value
  content: string; // Note content input value
  onTitleChange: (value: string) => void; // Handler for title change
  onContentChange: (value: string) => void; // Handler for content change
  onSave: () => void; // Handler for save action
  onCancel: () => void; // Handler for cancel action
  saving: boolean; // Saving state
}

// NewNoteForm component for creating a new note
export const NewNoteForm: React.FC<NewNoteFormProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  saving,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col max-w-90 h-70 rounded-lg border-4 shadow-lg  border-gray-800/70 p-4 mb-4 "
    >
      {/* Title input field */}
      <input
        className="w-full mb-2 px-2 py-1 rounded bg-gray-800/70 text-yellow-400 placeholder-gray-500"
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        disabled={saving}
      />
      {/* Content textarea field */}
      <textarea
        className="w-full mb-2 px-2 py-1 rounded bg-gray-800/70 text-white placeholder-gray-500"
        placeholder="Content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        rows={5}
        disabled={saving}
      />
      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        {/* Save button */}
        <button
          className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          onClick={onSave}
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
    </motion.div>
  );
};
