// store/workoutPlanStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan } from '../models/types';
import { MOCK_PLANS } from '../models/mockData';

const STORAGE_KEY = '@workout_plans';

interface WorkoutPlanState {
  plans: WorkoutPlan[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addPlan: (plan: WorkoutPlan) => Promise<void>;
  updatePlan: (plan: WorkoutPlan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  duplicatePlan: (id: string) => Promise<void>;
}

export const useWorkoutPlanStore = create<WorkoutPlanState>((set, get) => ({
  plans: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ plans: JSON.parse(raw), isHydrated: true });
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PLANS));
        set({ plans: MOCK_PLANS, isHydrated: true });
      }
    } catch {
      set({ plans: MOCK_PLANS, isHydrated: true });
    }
  },

  addPlan: async (plan) => {
    const updated = [...get().plans, plan];
    set({ plans: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updatePlan: async (plan) => {
    const updated = get().plans.map((p) => (p.id === plan.id ? plan : p));
    set({ plans: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deletePlan: async (id) => {
    const updated = get().plans.filter((p) => p.id !== id);
    set({ plans: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  duplicatePlan: async (id) => {
    const original = get().plans.find((p) => p.id === id);
    if (!original) return;
    const duplicate: WorkoutPlan = {
      ...original,
      id: Date.now().toString(),
      name: `${original.name} (Copia)`,
    };
    const updated = [...get().plans, duplicate];
    set({ plans: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
