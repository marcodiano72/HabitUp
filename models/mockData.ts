// models/mockData.ts
import { Exercise, WorkoutPlan, WorkoutSession, Goal, PlannedSession } from './types';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'e1',
    name: 'Piegamenti sulle braccia',
    description: 'Esercizio a corpo libero per pettorali e tricipiti. Mantieni il core contratto e il corpo in linea retta.',
    primaryMuscle: 'Pettorali',
    secondaryMuscles: ['Tricipiti', 'Spalle'],
    difficulty: 'Principiante',
    equipment: 'Corpo libero',
  },
  {
    id: 'e2',
    name: 'Squat con bilanciere',
    description: 'Esercizio fondamentale per le gambe. Scendi fino a quando le cosce sono parallele al suolo.',
    primaryMuscle: 'Quadricipiti',
    secondaryMuscles: ['Glutei', 'Femorali', 'Core'],
    difficulty: 'Intermedio',
    equipment: 'Bilanciere',
  },
  {
    id: 'e3',
    name: 'Trazioni alla sbarra',
    description: 'Ottimo per lo sviluppo del dorso e dei bicipiti. Parti da braccia distese e tirati su fino al mento sopra la sbarra.',
    primaryMuscle: 'Dorsali',
    secondaryMuscles: ['Bicipiti', 'Core'],
    difficulty: 'Avanzato',
    equipment: 'Sbarra',
  },
  {
    id: 'e4',
    name: 'Panca piana',
    description: 'Esercizio di spinta orizzontale per lo sviluppo del petto. Tieni i piedi a terra e la schiena con una leggera arcata naturale.',
    primaryMuscle: 'Pettorali',
    secondaryMuscles: ['Tricipiti', 'Deltoidi anteriori'],
    difficulty: 'Intermedio',
    equipment: 'Bilanciere',
  },
  {
    id: 'e5',
    name: 'Stacco da terra',
    description: 'Esercizio multi-articolare che coinvolge quasi tutto il corpo. Mantieni la schiena dritta e spingi con le gambe.',
    primaryMuscle: 'Femorali',
    secondaryMuscles: ['Glutei', 'Lombari', 'Trapezi'],
    difficulty: 'Avanzato',
    equipment: 'Bilanciere',
  },
  {
    id: 'e6',
    name: 'Curl con manubri',
    description: 'Isolamento dei bicipiti. Esegui il movimento in modo controllato, sia in fase concentrica che eccentrica.',
    primaryMuscle: 'Bicipiti',
    secondaryMuscles: ['Avambracci'],
    difficulty: 'Principiante',
    equipment: 'Manubri',
  },
  {
    id: 'e7',
    name: 'Plank',
    description: 'Esercizio isometrico per il rafforzamento del core. Mantieni il corpo in linea retta senza cedere ai fianchi.',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Spalle', 'Glutei'],
    difficulty: 'Principiante',
    equipment: 'Corpo libero',
  },
  {
    id: 'e8',
    name: 'Affondi con manubri',
    description: 'Esercizio unilaterale per gambe e glutei. Mantieni il busto eretto e il ginocchio anteriore sopra il piede.',
    primaryMuscle: 'Quadricipiti',
    secondaryMuscles: ['Glutei', 'Femorali', 'Core'],
    difficulty: 'Principiante',
    equipment: 'Manubri',
  },
  {
    id: 'e9',
    name: 'Shoulder Press con manubri',
    description: 'Spinta verticale per lo sviluppo delle spalle. Spingi i pesi direttamente sopra la testa.',
    primaryMuscle: 'Spalle',
    secondaryMuscles: ['Tricipiti', 'Trapezi'],
    difficulty: 'Intermedio',
    equipment: 'Manubri',
  },
  {
    id: 'e10',
    name: 'Rematore con bilanciere',
    description: 'Esercizio di trazione orizzontale per il dorso. Tira il bilanciere verso il basso addome mantenendo la schiena inclinata.',
    primaryMuscle: 'Dorsali',
    secondaryMuscles: ['Bicipiti', 'Romboidei', 'Core'],
    difficulty: 'Intermedio',
    equipment: 'Bilanciere',
  },
];

export const MOCK_PLANS: WorkoutPlan[] = [
  {
    id: 'p1',
    name: 'Full Body Base',
    description: 'Allenamento completo per chi inizia. Coinvolge tutti i principali gruppi muscolari.',
    goal: 'Condizionamento generale',
    level: 'Principiante',
    expectedDuration: 45,
    frequency: '3 giorni a settimana',
    exercises: [
      { exerciseId: 'e2', sets: 3, reps: 10, restTime: 90, order: 0 },
      { exerciseId: 'e1', sets: 3, reps: 12, restTime: 60, order: 1 },
      { exerciseId: 'e7', sets: 3, reps: 30, restTime: 45, order: 2 },
      { exerciseId: 'e8', sets: 3, reps: 10, restTime: 60, order: 3 },
    ],
  },
  {
    id: 'p2',
    name: 'Push Day (Forza)',
    description: 'Allenamento incentrato sui muscoli di spinta: petto, spalle, tricipiti.',
    goal: 'Forza massimale',
    level: 'Intermedio',
    expectedDuration: 60,
    frequency: '2 volte a settimana',
    exercises: [
      { exerciseId: 'e4', sets: 5, reps: 5, restTime: 180, weight: 80, order: 0 },
      { exerciseId: 'e9', sets: 4, reps: 8, restTime: 120, weight: 20, order: 1 },
      { exerciseId: 'e1', sets: 3, reps: 15, restTime: 60, order: 2 },
    ],
  },
  {
    id: 'p3',
    name: 'Pull Day (Ipertrofia)',
    description: 'Allenamento per dorso e bicipiti con focus sull\'ipertrofia muscolare.',
    goal: 'Ipertrofia',
    level: 'Avanzato',
    expectedDuration: 55,
    frequency: '2 volte a settimana',
    exercises: [
      { exerciseId: 'e3', sets: 4, reps: 8, restTime: 120, order: 0 },
      { exerciseId: 'e10', sets: 4, reps: 10, restTime: 90, weight: 60, order: 1 },
      { exerciseId: 'e6', sets: 3, reps: 12, restTime: 60, weight: 12, order: 2 },
    ],
  },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);

export const MOCK_SESSIONS: WorkoutSession[] = [
  {
    id: 's1',
    date: lastWeek.toISOString(),
    planId: 'p1',
    planName: 'Full Body Base',
    duration: 50,
    fatigueLevel: 6,
    exercisesDone: [
      { exerciseId: 'e2', sets: 3, reps: 10, weight: 40 },
      { exerciseId: 'e1', sets: 3, reps: 12, weight: 0 },
      { exerciseId: 'e7', sets: 3, reps: 30, weight: 0 },
    ],
    notes: 'Prima settimana, mi sono calibrato sui pesi.',
  },
  {
    id: 's2',
    date: yesterday.toISOString(),
    planId: 'p2',
    planName: 'Push Day (Forza)',
    duration: 65,
    fatigueLevel: 8,
    exercisesDone: [
      { exerciseId: 'e4', sets: 5, reps: 5, weight: 80 },
      { exerciseId: 'e9', sets: 4, reps: 8, weight: 20 },
      { exerciseId: 'e1', sets: 3, reps: 15, weight: 0 },
    ],
    notes: 'Ottima sessione, ho aumentato il peso sulla panca.',
  },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Arrivare a 10 Trazioni',
    description: 'Riuscire a fare 10 trazioni consecutive in modo pulito.',
    category: 'Forza',
    targetValue: 10,
    currentValue: 3,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Attivo',
  },
  {
    id: 'g2',
    title: 'Allenarsi 12 volte questo mese',
    category: 'Frequenza',
    targetValue: 12,
    currentValue: 2,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split('T')[0],
    status: 'Attivo',
  },
  {
    id: 'g3',
    title: 'Panca piana a 100kg',
    description: 'Raggiungere i 100kg alla panca piana con buona tecnica.',
    category: 'Forza',
    targetValue: 100,
    currentValue: 80,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Attivo',
  },
];

export const MOCK_PLANNED_SESSIONS: PlannedSession[] = [
  {
    id: 'ps1',
    planId: 'p1',
    scheduledDate: today.toISOString().split('T')[0],
    status: 'planned',
    notes: 'Sessione di oggi!',
  },
  {
    id: 'ps2',
    planId: 'p2',
    scheduledDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'planned',
  },
];