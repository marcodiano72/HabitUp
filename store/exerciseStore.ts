// store/exerciseStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Importiamo i tool per la persistenza
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importiamo la memoria del telefono

import { Exercise } from '../models/types';
import { MOCK_EXERCISES } from '../models/mockData';

// La struttura del nostro magazzino rimane identica
interface ExerciseState {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
}

// Creiamo il magazzino avvolgendolo in "persist"
export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      // Dati di partenza (se l'app viene aperta per la prima volta in assoluto)
      exercises: MOCK_EXERCISES,

      // Funzione per aggiungere un nuovo esercizio
      addExercise: (newExercise) => 
        set((state) => ({ 
          exercises: [...state.exercises, newExercise] 
        })),

      // Funzione per eliminare un esercizio
      deleteExercise: (id) => 
        set((state) => ({ 
          exercises: state.exercises.filter(exercise => exercise.id !== id) 
        })),
    }),
    {
      name: 'habitup-exercises-storage', // Il "nome del file" salvato nel telefono
      storage: createJSONStorage(() => AsyncStorage), // Diciamo di usare AsyncStorage
    }
  )
);