// models/types.ts

export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzato';
export type GoalStatus = 'Attivo' | 'Completato' | 'Abbandonato';
export type SessionStatus = 'planned' | 'completed' | 'skipped';

// ─────────────────────────────────────────────
//  1. ESERCIZIO
// ─────────────────────────────────────────────
export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  difficulty: Difficulty;
  equipment: string;
  estimatedDuration?: number; // in minuti
  notes?: string;
}

// ─────────────────────────────────────────────
//  2. SCHEDA DI ALLENAMENTO
// ─────────────────────────────────────────────
export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number; // in secondi
  weight?: number;  // peso suggerito in kg
  order: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  goal: string;
  level: Difficulty;
  expectedDuration: number; // in minuti
  frequency?: string;
  exercises: PlanExercise[];
  notes?: string;
}

// ─────────────────────────────────────────────
//  3. SESSIONE PIANIFICATA
// ─────────────────────────────────────────────
export interface PlannedSession {
  id: string;
  planId: string;
  scheduledDate: string;   // formato: 'YYYY-MM-DD'
  status: SessionStatus;
  notes?: string;
  notificationId?: string; // ID della notifica locale programmata
}

// ─────────────────────────────────────────────
//  4. STORICO ALLENAMENTO (sessione completata)
// ─────────────────────────────────────────────
export interface SessionExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number; // kg
}

export interface WorkoutSession {
  id: string;
  date: string;           // ISO 8601
  planId?: string;
  planName?: string;      // snapshot del nome al momento dell'allenamento
  duration: number;       // in minuti
  exercisesDone: SessionExercise[];
  fatigueLevel: number;   // 1–10
  notes?: string;
}

// ─────────────────────────────────────────────
//  5. OBIETTIVO FISICO
// ─────────────────────────────────────────────
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate?: string;
  status: GoalStatus;
}