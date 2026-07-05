// store/exerciseStore.ts
import { create } from 'zustand';
import { StorageService } from '../services/storageService';
import { Exercise } from '../models/types';
import { MOCK_EXERCISES } from '../models/mockData';

const STORAGE_KEY = '@exercises';

interface ExerciseState {
  exercises: Exercise[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addExercise: (exercise: Exercise) => Promise<void>;
  updateExercise: (exercise: Exercise) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const data = await StorageService.get<Exercise[]>(STORAGE_KEY);
      if (data) {
        set({ exercises: data, isHydrated: true });
      } else {
        // Prima installazione: carichiamo i dati di esempio
        await StorageService.set(STORAGE_KEY, MOCK_EXERCISES);
        set({ exercises: MOCK_EXERCISES, isHydrated: true });
      }
    } catch {
      set({ exercises: MOCK_EXERCISES, isHydrated: true });
    }
  },

  addExercise: async (exercise) => {
    const updated = [...get().exercises, exercise];
    set({ exercises: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  updateExercise: async (exercise) => {
    const updated = get().exercises.map((e) => (e.id === exercise.id ? exercise : e));
    set({ exercises: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },

  deleteExercise: async (id) => {
    const updated = get().exercises.filter((e) => e.id !== id);
    set({ exercises: updated });
    await StorageService.set(STORAGE_KEY, updated);
  },
}));
