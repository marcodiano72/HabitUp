// models/mockData.ts
import { Exercise, WorkoutPlan, WorkoutSession, Goal } from './types';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'e1',
    name: 'Piegamenti sulle braccia (Push-up)',
    description: 'Esercizio a corpo libero per petto e tricipiti.',
    primaryMuscle: 'Pettorali',
    secondaryMuscles: ['Tricipiti', 'Spalle'],
    difficulty: 'Principiante',
    equipment: 'Corpo libero',
  },
  {
    id: 'e2',
    name: 'Squat con bilanciere',
    description: 'Esercizio fondamentale per le gambe.',
    primaryMuscle: 'Quadricipiti',
    secondaryMuscles: ['Glutei', 'Femorali', 'Core'],
    difficulty: 'Intermedio',
    equipment: 'Bilanciere',
  },
  {
    id: 'e3',
    name: 'Trazioni alla sbarra (Pull-up)',
    description: 'Ottimo per lo sviluppo del dorso.',
    primaryMuscle: 'Dorsali',
    secondaryMuscles: ['Bicipiti'],
    difficulty: 'Avanzato',
    equipment: 'Sbarra',
  }
];

export const MOCK_PLANS: WorkoutPlan[] = [
  {
    id: 'p1',
    name: 'Total Body Base',
    description: 'Allenamento completo per chi inizia.',
    goal: 'Condizionamento generale',
    level: 'Principiante',
    expectedDuration: 45,
    frequency: '3 giorni a settimana',
    exercises: [
      { exerciseId: 'e2', sets: 3, reps: 10, restTime: 90 }, // Squat
      { exerciseId: 'e1', sets: 3, reps: 8, restTime: 60 },  // Push-up
    ]
  }
];

export const MOCK_SESSIONS: WorkoutSession[] = [
  {
    id: 's1',
    date: new Date().toISOString(),
    planId: 'p1',
    duration: 50,
    fatigueLevel: 7, // Scala 1-10
    exercisesDone: [
      { exerciseId: 'e2', sets: 3, reps: 10, weight: 40 },
      { exerciseId: 'e1', sets: 3, reps: 8, weight: 0 },
    ],
    notes: 'Mi sentivo in forma, ma gli squat erano pesanti.'
  }
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Arrivare a 10 Trazioni',
    description: 'Riuscire a fare 10 trazioni di fila in modo pulito.',
    category: 'Forza',
    targetValue: 10,
    currentValue: 3,
    startDate: '2024-01-01',
    status: 'Attivo'
  },
  {
    id: 'g2',
    title: 'Allenarsi 3 volte a settimana',
    category: 'Frequenza',
    targetValue: 12, // 12 volte in un mese
    currentValue: 5,
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    status: 'Attivo'
  }
];