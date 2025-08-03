import React from "react";

interface NewNoteFormProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

export const NewNoteForm: React.FC<NewNoteFormProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  saving,
}) => (
  <div className="flex flex-col max-w-90 h-70 rounded-lg border-4 border-gray-800 p-4 mb-4 ">
    <input
      className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-yellow-400 placeholder-gray-500"
      placeholder="Title"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      disabled={saving}
    />
    <textarea
      className="w-full mb-2 px-2 py-1 rounded bg-gray-800 text-white placeholder-gray-500"
      placeholder="Content"
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      rows={5}
      disabled={saving}
    />
    <div className="flex gap-2 justify-center">
      <button
        className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
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
