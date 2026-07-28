import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import type { NotebookEntry, NotebookFolder, ResearchProject } from '@/types';

// ============================================================
// Research Notebook state
// ============================================================

interface NotebookState {
  entries: NotebookEntry[];
  folders: NotebookFolder[];
  projects: ResearchProject[];
  activeFolder: string | null;
  activeProject: string | null;

  // Bookmarks
  addBookmark: (investigationId: string, tags?: string[]) => void;
  removeBookmark: (investigationId: string) => void;
  isBookmarked: (investigationId: string) => boolean;

  // Notes
  addNote: (investigationId: string, content: string, tags?: string[]) => NotebookEntry;
  updateNote: (id: string, content: string) => void;
  removeNote: (id: string) => void;

  // Highlights
  addHighlight: (investigationId: string, text: string, color?: string) => void;
  removeHighlight: (id: string) => void;

  // Folders
  createFolder: (name: string, color?: string) => NotebookFolder;
  deleteFolder: (id: string) => void;
  setActiveFolder: (id: string | null) => void;

  // Projects
  createProject: (name: string, description?: string) => ResearchProject;
  addInvestigationToProject: (projectId: string, investigationId: string) => void;
  removeInvestigationFromProject: (projectId: string, investigationId: string) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;

  // Queries
  getEntriesForInvestigation: (investigationId: string) => NotebookEntry[];
  getBookmarkedIds: () => string[];
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const now = () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      entries: [],
      folders: [],
      projects: [],
      activeFolder: null,
      activeProject: null,

      addBookmark: (investigationId, tags = []) => {
        if (get().isBookmarked(investigationId)) return;
        const entry: NotebookEntry = {
          id: generateId(),
          investigationId,
          type: 'bookmark',
          createdAt: now(),
          updatedAt: now(),
          tags,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
      },

      removeBookmark: (investigationId) =>
        set((state) => ({
          entries: state.entries.filter(
            (e) => !(e.investigationId === investigationId && e.type === 'bookmark')
          ),
        })),

      isBookmarked: (investigationId) =>
        get().entries.some(
          (e) => e.investigationId === investigationId && e.type === 'bookmark'
        ),

      addNote: (investigationId, content, tags = []) => {
        const entry: NotebookEntry = {
          id: generateId(),
          investigationId,
          type: 'note',
          content,
          createdAt: now(),
          updatedAt: now(),
          tags,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
        return entry;
      },

      updateNote: (id, content) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, content, updatedAt: now() } : e
          ),
        })),

      removeNote: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      addHighlight: (investigationId, text, color = '#fbbf24') => {
        const entry: NotebookEntry = {
          id: generateId(),
          investigationId,
          type: 'highlight',
          highlightedText: text,
          color,
          createdAt: now(),
          updatedAt: now(),
          tags: [],
        };
        set((state) => ({ entries: [...state.entries, entry] }));
      },

      removeHighlight: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      createFolder: (name, color = '#6370f1') => {
        const folder: NotebookFolder = {
          id: generateId(),
          name,
          color,
          createdAt: now(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return folder;
      },

      deleteFolder: (id) =>
        set((state) => ({ folders: state.folders.filter((f) => f.id !== id) })),

      setActiveFolder: (id) => set({ activeFolder: id }),

      createProject: (name, description = '') => {
        const project: ResearchProject = {
          id: generateId(),
          name,
          description,
          createdAt: now(),
          updatedAt: now(),
          investigationIds: [],
          tags: [],
          folders: [],
          notes: [],
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },

      addInvestigationToProject: (projectId, investigationId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId && !p.investigationIds.includes(investigationId)
              ? { ...p, investigationIds: [...p.investigationIds, investigationId] }
              : p
          ),
        })),

      removeInvestigationFromProject: (projectId, investigationId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, investigationIds: p.investigationIds.filter((id) => id !== investigationId) }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

      setActiveProject: (id) => set({ activeProject: id }),

      getEntriesForInvestigation: (investigationId) =>
        get().entries.filter((e) => e.investigationId === investigationId),

      getBookmarkedIds: () =>
        get()
          .entries.filter((e) => e.type === 'bookmark')
          .map((e) => e.investigationId),
    }),
    {
      name: 'ntsb-notebook-state',
    }
  )
);
