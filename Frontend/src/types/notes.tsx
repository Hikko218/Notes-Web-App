
interface SavedNote {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  userId: number;
  folderId: number;
}

interface Folder {
  id: number;
  name: string;
}


export interface NotesSectionProps {
  notes: SavedNote[];
  folders: Folder[]
  selectedFolderId: number | null
  setSelectedFolderId: (id: number | null) => void
  loading: boolean;
  error: string | null;
  showNewNote: boolean;
  newTitle: string;
  newContent: string;
  saving: boolean;
  editingNoteId: number | null;
  handleAddNote: () => void;
  handleSaveNote: () => void;
  handleEditSave: (id: number, title: string, content: string) => void;
  handleDeleteNote: (id: number) => void;
  setNewTitle: (title: string) => void;
  setNewContent: (content: string) => void;
  setShowNewNote: (show: boolean) => void;
  setEditingNoteId: (id: number | null) => void;
  fetchFolders: () => void;
  title?: string;
}