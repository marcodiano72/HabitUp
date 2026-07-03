// models/types.ts

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzato';
export type GoalStatus = 'Attivo' | 'Completato' | 'Abbandonato';

// 1. ESERCIZIO
export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  difficulty: Difficulty;
  equipment: string; // es. "Manubri", "Corpo libero", "Macchinario"
  estimatedDuration?: number; // in minuti
  notes?: string;
}

// 2. SCHEDA DI ALLENAMENTO
// Rappresenta il legame tra la scheda e l'esercizio (con serie, rep, ecc.)
export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number; // in secondi
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  goal: string; // es. "Ipertrofia", "Dimagrimento"
  level: Difficulty;
  expectedDuration: number; // in minuti
  frequency?: string; // es. "3 volte a settimana"
  exercises: PlanExercise[];
  notes?: string;
}

// 3. SESSIONE / ALLENAMENTO SVOLTO
// Rappresenta l'esercizio effettivamente svolto in una determinata sessione
export interface SessionExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number; // Carico utilizzato in kg
}

export interface WorkoutSession {
  id: string;
  date: string; // Formato ISO, es. "2024-10-25T10:00:00Z"
  planId?: string; // Opzionale: se la sessione deriva da una scheda
  duration: number; // in minuti
  exercisesDone: SessionExercise[];
  fatigueLevel: number; // Scala da 1 a 10 (RPE)
  notes?: string;
}

// 4. OBIETTIVO
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string; // es. "Forza", "Resistenza", "Peso corporeo"
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate?: string;
  status: GoalStatus;
}