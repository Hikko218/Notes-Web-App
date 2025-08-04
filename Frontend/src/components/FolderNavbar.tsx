import React from "react";
import { Folder } from "lucide-react";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/components/useAuthStatus";
import { motion } from "framer-motion";
import { NewFolderForm } from "./NewFolderForm";

export interface FolderNavbarProps {
  folders: { id: number; name: string }[];
  selectedFolderId: number | null;
  setSelectedFolderId: (id: number | null) => void;
  fetchFolders: () => void;
}

const URL = process.env.NEXT_PUBLIC_API_URL;

// FolderNavbar component for displaying and managing folders
export const FolderNavbar: React.FC<FolderNavbarProps> = ({
  folders,
  selectedFolderId,
  setSelectedFolderId,
  fetchFolders,
}) => {
  // State to show/hide new folder form
  const [showNewFolder, setShowNewFolder] = React.useState(false);
  // State for new folder name input
  const [newFolderName, setNewFolderName] = React.useState("");
  // State for saving indicator
  const [saving, setSaving] = React.useState(false);
  // State for currently editing folder id
  const [editingFolderId, setEditingFolderId] = React.useState<number | null>(
    null
  );
  // State for currently editing folder name
  const [editingFolderName, setEditingFolderName] = React.useState("");

  // Get userId from auth context
  const { userId } = useAuth();

  // Save a new folder to the backend
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

  // Activate edit mode for a folder
  const startEditFolder = (folderId: number, name: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(name);
  };

  // Save edits to an existing folder
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

  // Delete a folder
  const handleDeleteFolder = async (folderId: number) => {
    const res = await fetch(`${URL}/folder/${folderId}`, {
      method: "Delete",
    });
    if (res.ok) {
      fetchFolders();
    }
  };

  return (
    <nav className="flex flex-col items-center w-full mt-4">
      <div className="w-full flex justify-center">
        <div className="flex w-full items-center justify-center">
          {/* Folder Buttons + Add Button in one row */}
          <motion.div
            className="flex md:flex-row flex-col gap-2 items-center justify-center w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 0, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div
                className={`px-2 py-1 rounded-lg font-semibold border bg-gray-800/70 text-white border-white flex items-center gap-2 hover:border-yellow-500 transition-all cursor-pointer shadow-lg ${
                  selectedFolderId === null ? "border-yellow-500" : ""
                }`}
                onClick={() => setSelectedFolderId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedFolderId(null);
                }}
              >
                <Folder size={18} />
                All
              </div>
            </motion.div>
            {folders.map((folder, idx) => (
              <motion.div
                key={folder.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.12 }}
                className="flex items-center gap-2"
              >
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
                    className={`px-2 py-1 rounded-lg font-semibold border bg-gray-800/70 text-white border-white flex items-center gap-2 hover:border-yellow-500 transition-all cursor-pointer shadow-lg ${
                      selectedFolderId === folder.id ? "border-yellow-500" : ""
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
                      className="ml-1 rounded text-white hover:text-yellow-500"
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
                      className="rounded text-white hover:text-red-600"
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
              </motion.div>
            ))}
            {/* Add Folder Button */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.2 + folders.length * 0.08 }}
              className="flex items-center gap-2"
            >
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
                  className="flex flex-row gap-2 text-white hover:text-yellow-500"
                  style={{ padding: 0 }}
                  onClick={() => setShowNewFolder(true)}
                  aria-label="Add Folder"
                >
                  <CirclePlus size={24} />
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};
