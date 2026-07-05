// store/historyStore.ts
import { create } from 'zustand';
import { StorageService } from '../services/storageService';
import { WorkoutSession } from '../models/types';
import { MOCK_SESSIONS } from '../models/mockData';

const STORAGE_KEY = '@workout_history';

interface HistoryState {
  history: WorkoutSession[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addSession: (session: WorkoutSession) => Promise<void>;
  updateSession: (session: WorkoutSession) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await StorageService.get<WorkoutSession[]>(STORAGE_KEY);
      if (data) {
        set({ history: data, isHydrated: true });
      } else {
        await StorageService.set(STORAGE_KEY, MOCK_SESSIONS);
        set({ history: MOCK_SESSIONS, isHydrated: true });
      }
    } catch {
      set({ history: MOCK_SESSIONS, isHydrated: true });
    }
  },

  addSession: async (session) => {
    const updated = [session, ...get().history];
    set({ history: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  updateSession: async (session) => {
    const updated = get().history.map((s) => (s.id === session.id ? session : s));
    set({ history: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  deleteSession: async (id) => {
    const updated = get().history.filter((s) => s.id !== id);
    set({ history: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },
}));
