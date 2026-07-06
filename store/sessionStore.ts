// store/sessionStore.ts
import { create } from 'zustand';
import { StorageService } from '../services/storageService';
import { PlannedSession } from '../models/types';
import { MOCK_PLANNED_SESSIONS } from '../models/mockData';
import { getLocalDateString } from '../utils/date';

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
      let data = await StorageService.get<PlannedSession[]>(STORAGE_KEY);
      if (data) {
        // Aggiorna le date delle sessioni mock per mantenerle coerenti con la data corrente
        const todayStr = getLocalDateString();
        data = data.map((s) => {
          if (s.id === 'ps1') {
            return { ...s, scheduledDate: todayStr };
          }
          if (s.id === 'ps2') {
            const afterTwoDays = new Date();
            afterTwoDays.setDate(afterTwoDays.getDate() + 2);
            return { ...s, scheduledDate: getLocalDateString(afterTwoDays) };
          }
          return s;
        });
        set({ sessions: data, isHydrated: true });
        await StorageService.set(STORAGE_KEY, data);
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
      scheduledDate: getLocalDateString(tomorrow),
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
