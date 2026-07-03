// store/historyStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession } from '../models/types';
import { MOCK_SESSIONS } from '../models/mockData';

const STORAGE_KEY = '@workout_history';

interface HistoryState {
  history: WorkoutSession[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addSession: (session: WorkoutSession) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ history: JSON.parse(raw), isHydrated: true });
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SESSIONS));
        set({ history: MOCK_SESSIONS, isHydrated: true });
      }
    } catch {
      set({ history: MOCK_SESSIONS, isHydrated: true });
    }
  },

  addSession: async (session) => {
    const updated = [session, ...get().history];
    set({ history: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteSession: async (id) => {
    const updated = get().history.filter((s) => s.id !== id);
    set({ history: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
