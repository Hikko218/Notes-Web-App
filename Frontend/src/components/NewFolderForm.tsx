import React from "react";

interface NewFolderFormProps {
  name: string;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

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
    <input
      className="rounded bg-gray-800 text-yellow-400 placeholder-gray-500 text-center px-2 py-1"
      style={{ width: "120px", minWidth: 0, height: "32px" }}
      placeholder="Name"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      disabled={saving}
    />
    <button
      className="rounded bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1"
      style={{ height: "32px", minWidth: "60px" }}
      onClick={onSave}
      disabled={saving}
    >
      {saving ? "Saving..." : "Save"}
    </button>
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
