import React from "react";
import { Folder } from "lucide-react";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/components/useAuthStatus";
import { NewFolderForm } from "./NewFolderForm";

export interface FolderNavbarProps {
  folders: { id: number; name: string }[];
  selectedFolderId: number | null;
  setSelectedFolderId: (id: number | null) => void;
  fetchFolders: () => void;
}

const URL = process.env.NEXT_PUBLIC_API_URL;

export const FolderNavbar: React.FC<FolderNavbarProps> = ({
  folders,
  selectedFolderId,
  setSelectedFolderId,
  fetchFolders,
}) => {
  const [showNewFolder, setShowNewFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [editingFolderId, setEditingFolderId] = React.useState<number | null>(
    null
  );
  const [editingFolderName, setEditingFolderName] = React.useState("");

  const { userId } = useAuth();

  // Handle safe folder
  const handleSaveFolder = async () => {
    if (!newFolderName.trim()) return;
    setSaving(true);
    const res = await fetch(`${URL}/folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        name: newFolderName,
      }),
    });
    if (res.ok) {
      setShowNewFolder(false);
      setNewFolderName("");
      fetchFolders();
    }
    setSaving(false);
  };

  // Edit-Button klick: Edit-Modus aktivieren
  const startEditFolder = (folderId: number, name: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  // Handle edit folder (PUT)
  const handleEditFolder = async () => {
    if (!editingFolderName.trim() || editingFolderId === null) return;
    setSaving(true);
    const res = await fetch(`${URL}/folder/${editingFolderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingFolderName,
      }),
    });
    if (res.ok) {
      setEditingFolderId(null);
      setEditingFolderName("");
      fetchFolders();
    }
    setSaving(false);
  };

  // Handle delete folder
  const handleDeleteFolder = async (folderId: number) => {
    const res = await fetch(`${URL}/folder/${folderId}`, {
      method: "Delete",
    });
    if (res.ok) {
      fetchFolders();
    }
  };

  return (
    <nav className="flex flex-col items-center w-full">
      <div className="w-full flex justify-center mb-4">
        <div className="flex items-center gap-2">
          {showNewFolder ? (
            <NewFolderForm
              name={newFolderName}
              onNameChange={setNewFolderName}
              onSave={handleSaveFolder}
              onCancel={() => setShowNewFolder(false)}
              saving={saving}
            />
          ) : (
            <button
              className="text-yellow-500 hover:text-white mt-4"
              style={{ padding: 0 }}
              onClick={() => setShowNewFolder(true)}
              aria-label="Add Folder"
            >
              <CirclePlus size={28} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-row md:gap-2">
          <button
            className={`px-4 py-2 rounded font-semibold border transition-all ${
              selectedFolderId === null
                ? "bg-yellow-500 text-white"
                : "bg-gray-800 text-yellow-400 border-yellow-500"
            }`}
            onClick={() => setSelectedFolderId(null)}
          >
            All
          </button>
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-2">
              {editingFolderId === folder.id ? (
                <>
                  <input
                    className="px-2 py-1 rounded border border-yellow-500 bg-gray-900 text-yellow-400 w-32"
                    value={editingFolderName}
                    onChange={(e) => setEditingFolderName(e.target.value)}
                    disabled={saving}
                    autoFocus
                  />
                  <button
                    className="px-2 py-1 rounded bg-yellow-500 text-white font-semibold ml-1"
                    onClick={handleEditFolder}
                    disabled={saving}
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-gray-700 text-yellow-400 font-semibold ml-1"
                    onClick={() => {
                      setEditingFolderId(null);
                      setEditingFolderName("");
                    }}
                    disabled={saving}
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div
                  className={`px-4 py-2 rounded font-semibold border flex items-center gap-2 hover:border-white transition-all cursor-pointer ${
                    selectedFolderId === folder.id
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-800 text-yellow-400 border-yellow-500"
                  }`}
                  onClick={() => setSelectedFolderId(folder.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelectedFolderId(folder.id);
                  }}
                >
                  <Folder size={18} />
                  {folder.name}
                  <button
                    className="ml-1 rounded hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditFolder(folder.id, folder.name);
                    }}
                    title="Edit Folder"
                    aria-label="Edit Folder"
                    type="button"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="rounded hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    title="Delete Folder"
                    aria-label="Delete Folder"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
