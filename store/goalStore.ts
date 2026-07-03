// store/goalStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../models/types';
import { MOCK_GOALS } from '../models/mockData';

const STORAGE_KEY = '@goals';

interface GoalState {
  goals: Goal[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateProgress: (id: string, newValue: number) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ goals: JSON.parse(raw), isHydrated: true });
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_GOALS));
        set({ goals: MOCK_GOALS, isHydrated: true });
      }
    } catch {
      set({ goals: MOCK_GOALS, isHydrated: true });
    }
  },

  addGoal: async (goal) => {
    const updated = [...get().goals, goal];
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateGoal: async (goal) => {
    const updated = get().goals.map((g) => (g.id === goal.id ? goal : g));
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateProgress: async (id, newValue) => {
    const updated = get().goals.map((g) => {
      if (g.id !== id) return g;
      const isAchieved = newValue >= g.targetValue;
      return {
        ...g,
        currentValue: newValue,
        status: isAchieved ? ('Completato' as const) : g.status,
      };
    });
    set({ goals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
