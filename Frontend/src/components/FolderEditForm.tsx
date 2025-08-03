// src/components/FolderEditForm.tsx
import React, { useState } from "react";

interface FolderEditFormProps {
  initialName: string;
  saving: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function FolderEditForm({ initialName, saving, onSave, onCancel }: FolderEditFormProps) {
  const [name, setName] = useState(initialName);

  return (
    <div className="flex justify-center rounded-xl bg-black/60 max-w-90 h-30">
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(name);
      }}
      className="flex flex-col p-2 gap-2"
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="px-2 py-1 placeholder-center rounded bg-gray-800 text-yellow-400 placeholder-gray-500"
        disabled={saving}
      />
      <div className="flex justify-center gap-2">
        <button type="submit" className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600" disabled={saving}>
          Save
        </button>
        <button type="button" className="bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-800" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
}