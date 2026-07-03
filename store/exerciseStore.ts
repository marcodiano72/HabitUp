// store/exerciseStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ exercises: JSON.parse(raw), isHydrated: true });
      } else {
        // Prima installazione: carichiamo i dati di esempio
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_EXERCISES));
        set({ exercises: MOCK_EXERCISES, isHydrated: true });
      }
    } catch {
      set({ exercises: MOCK_EXERCISES, isHydrated: true });
    }
  },

  addExercise: async (exercise) => {
    const updated = [...get().exercises, exercise];
    set({ exercises: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateExercise: async (exercise) => {
    const updated = get().exercises.map((e) => (e.id === exercise.id ? exercise : e));
    set({ exercises: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteExercise: async (id) => {
    const updated = get().exercises.filter((e) => e.id !== id);
    set({ exercises: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
