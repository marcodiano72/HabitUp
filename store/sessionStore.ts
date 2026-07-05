// store/sessionStore.ts
import { create } from 'zustand';
import { StorageService } from '../services/storageService';
import { PlannedSession } from '../models/types';
import { MOCK_PLANNED_SESSIONS } from '../models/mockData';

const STORAGE_KEY = '@planned_sessions';

interface SessionState {
  sessions: PlannedSession[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addSession: (session: PlannedSession) => Promise<void>;
  updateSession: (session: PlannedSession) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  duplicateSession: (id: string) => Promise<void>;
  markCompleted: (id: string) => Promise<void>;
  markSkipped: (id: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await StorageService.get<PlannedSession[]>(STORAGE_KEY);
      if (data) {
        set({ sessions: data, isHydrated: true });
      } else {
        await StorageService.set(STORAGE_KEY, MOCK_PLANNED_SESSIONS);
        set({ sessions: MOCK_PLANNED_SESSIONS, isHydrated: true });
      }
    } catch {
      set({ sessions: [], isHydrated: true });
    }
  },

  addSession: async (session) => {
    const updated = [...get().sessions, session];
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  updateSession: async (session) => {
    const updated = get().sessions.map((s) => (s.id === session.id ? session : s));
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  deleteSession: async (id) => {
    const updated = get().sessions.filter((s) => s.id !== id);
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  duplicateSession: async (id) => {
    const original = get().sessions.find((s) => s.id === id);
    if (!original) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const duplicate: PlannedSession = {
      ...original,
      id: Date.now().toString(),
      scheduledDate: tomorrow.toISOString().split('T')[0],
      status: 'planned',
    };
    const updated = [...get().sessions, duplicate];
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  markCompleted: async (id) => {
    const updated = get().sessions.map((s) =>
      s.id === id ? { ...s, status: 'completed' as const } : s
    );
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  markSkipped: async (id) => {
    const updated = get().sessions.map((s) =>
      s.id === id ? { ...s, status: 'skipped' as const } : s
    );
    set({ sessions: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },
}));
