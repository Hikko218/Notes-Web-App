// Import React and useState hook
import React, { useState } from "react";

// Props for the FolderEditForm component
interface FolderEditFormProps {
  initialName: string; // Initial folder name
  saving: boolean; // Saving state
  onSave: (name: string) => void; // Save handler
  onCancel: () => void; // Cancel handler
}

// FolderEditForm component for editing a folder's name
export function FolderEditForm({
  initialName,
  saving,
  onSave,
  onCancel,
}: FolderEditFormProps) {
  // State for folder name input
  const [name, setName] = useState(initialName);

  return (
    <div className="flex justify-center rounded-xl bg-black/60 max-w-90 h-30">
      {/* Form for editing folder name */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(name);
        }}
        className="flex flex-col p-2 gap-2"
      >
        {/* Folder name input field */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 placeholder-center rounded bg-gray-800 text-yellow-400 placeholder-gray-500"
          disabled={saving}
        />
        {/* Action buttons */}
        <div className="flex justify-center gap-2">
          {/* Save button */}
          <button
            type="submit"
            className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
            disabled={saving}
          >
            Save
          </button>
          {/* Cancel button */}
          <button
            type="button"
            className="bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-800"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
