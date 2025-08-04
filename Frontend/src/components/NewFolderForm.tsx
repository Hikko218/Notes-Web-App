// Import React
import React from "react";

// Props for the NewFolderForm component
interface NewFolderFormProps {
  name: string; // Folder name input value
  onNameChange: (value: string) => void; // Handler for name change
  onSave: () => void; // Handler for save action
  onCancel: () => void; // Handler for cancel action
  saving: boolean; // Saving state
}

// NewFolderForm component for creating a new folder
export const NewFolderForm: React.FC<NewFolderFormProps> = ({
  name,
  onSave,
  onNameChange,
  onCancel,
  saving,
}) => (
  <div
    className="flex flex-row items-center gap-2 rounded-lg px-2 py-1 shadow"
    style={{ height: "40px", minWidth: 0 }}
  >
    {/* Folder name input field */}
    <input
      className="rounded bg-gray-800 text-yellow-400 placeholder-gray-500 text-center px-2 py-1"
      style={{ width: "120px", minWidth: 0, height: "32px" }}
      placeholder="Name"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      disabled={saving}
    />
    {/* Save button */}
    <button
      className="rounded bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1"
      style={{ height: "32px", minWidth: "60px" }}
      onClick={onSave}
      disabled={saving}
    >
      {saving ? "Saving..." : "Save"}
    </button>
    {/* Cancel button */}
    <button
      className="rounded bg-gray-700 text-white hover:bg-gray-800 px-3 py-1"
      style={{ height: "32px", minWidth: "60px" }}
      onClick={onCancel}
      disabled={saving}
    >
      Cancel
    </button>
  </div>
);
