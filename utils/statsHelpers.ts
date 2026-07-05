import { WorkoutSession, Exercise } from '../models/types';

/**
 * Calcola la durata totale in minuti di tutte le sessioni completate.
 */
export function calculateTotalMinutes(history: WorkoutSession[]): number {
  return history.reduce((acc, s) => acc + s.duration, 0);
}

/**
 * Calcola il livello medio di fatica percepito (RPE) su una scala da 1 a 10.
 * Ritorna una stringa formattata con un decimale o '—' se non ci sono dati.
 */
export function calculateAverageRPE(history: WorkoutSession[]): string {
  if (history.length === 0) return '—';
  const totalRPE = history.reduce((acc, s) => acc + s.fatigueLevel, 0);
  return (totalRPE / history.length).toFixed(1);
}

/**
 * Prepara i dati per il grafico a barre della durata delle ultime sessioni completate (max 6).
 */
export function formatDurationChartData(
  history: WorkoutSession[],
  primaryColor: string
): Array<{ value: number; label: string; frontColor: string }> {
  const recentSessions = [...history].slice(0, 6).reverse();
  return recentSessions.map((s) => {
    const d = new Date(s.date);
    return {
      value: s.duration,
      label: d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      frontColor: primaryColor,
    };
  });
}

/**
 * Prepara i dati per il grafico a linee del livello di fatica (RPE) delle ultime sessioni completate (max 6).
 */
export function formatRPEChartData(
  history: WorkoutSession[],
  accentColor: string
): Array<{ value: number; label: string; dataPointText: string; frontColor: string }> {
  const recentSessions = [...history].slice(0, 6).reverse();
  return recentSessions.map((s) => {
    const d = new Date(s.date);
    return {
      value: s.fatigueLevel,
      label: d.toLocaleDateString('it-IT', { day: 'numeric' }),
      dataPointText: `RPE ${s.fatigueLevel}`,
      frontColor: accentColor,
    };
  });
}

/**
 * Prepara i dati per il grafico del volume muscolare (serie totali per gruppo muscolare principale).
 */
export function formatMuscleVolumeChartData(
  history: WorkoutSession[],
  exercises: Exercise[],
  accentColor: string
): Array<{ value: number; label: string; frontColor: string }> {
  const muscleGroupsCount: Record<string, number> = {};

  history.forEach((sessione) => {
    sessione.exercisesDone.forEach((exDone) => {
      const exDetail = exercises.find((e) => e.id === exDone.exerciseId);
      if (exDetail) {
        const muscle = exDetail.primaryMuscle;
        muscleGroupsCount[muscle] = (muscleGroupsCount[muscle] || 0) + exDone.sets;
      }
    });
  });

  return Object.keys(muscleGroupsCount).map((muscolo) => ({
    value: muscleGroupsCount[muscolo],
    label: muscolo.substring(0, 6),
    frontColor: accentColor,
  }));
}
