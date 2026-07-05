// store/workoutPlanStore.ts
import { create } from 'zustand';
import { StorageService } from '../services/storageService';
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
      const data = await StorageService.get<WorkoutPlan[]>(STORAGE_KEY);
      if (data) {
        set({ plans: data, isHydrated: true });
      } else {
        await StorageService.set(STORAGE_KEY, MOCK_PLANS);
        set({ plans: MOCK_PLANS, isHydrated: true });
      }
    } catch {
      set({ plans: MOCK_PLANS, isHydrated: true });
    }
  },

  addPlan: async (plan) => {
    const updated = [...get().plans, plan];
    set({ plans: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  updatePlan: async (plan) => {
    const updated = get().plans.map((p) => (p.id === plan.id ? plan : p));
    set({ plans: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  deletePlan: async (id) => {
    const updated = get().plans.filter((p) => p.id !== id);
    set({ plans: updated });
    await StorageService.set(STORAGE_KEY, updated);
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
    await StorageService.set(STORAGE_KEY, updated);
  },
}));
