// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useExerciseStore } from '../store/exerciseStore';
import { useWorkoutPlanStore } from '../store/workoutPlanStore';
import { useSessionStore } from '../store/sessionStore';
import { useHistoryStore } from '../store/historyStore';
import { useGoalStore } from '../store/goalStore';

export default function RootLayout() {
  const hydrateExercises = useExerciseStore((s) => s.hydrate);
  const hydratePlans = useWorkoutPlanStore((s) => s.hydrate);
  const hydrateSessions = useSessionStore((s) => s.hydrate);
  const hydrateHistory = useHistoryStore((s) => s.hydrate);
  const hydrateGoals = useGoalStore((s) => s.hydrate);

  useEffect(() => {
    hydrateExercises();
    hydratePlans();
    hydrateSessions();
    hydrateHistory();
    hydrateGoals();
  }, [hydrateExercises, hydratePlans, hydrateSessions, hydrateHistory, hydrateGoals]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', color: '#FFFFFF' },
          contentStyle: { backgroundColor: '#0F0F1A' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise/[id]"
          options={{ title: 'Dettaglio Esercizio', presentation: 'card' }}
        />
        <Stack.Screen
          name="exercise/create"
          options={{ title: 'Nuovo Esercizio', presentation: 'modal' }}
        />
        <Stack.Screen
          name="exercise/edit/[id]"
          options={{ title: 'Modifica Esercizio', presentation: 'modal' }}
        />
        <Stack.Screen
          name="plan/[id]"
          options={{ title: 'Dettaglio Scheda', presentation: 'card' }}
        />
        <Stack.Screen
          name="plan/create"
          options={{ title: 'Nuova Scheda', presentation: 'modal' }}
        />
        <Stack.Screen
          name="plan/edit/[id]"
          options={{ title: 'Modifica Scheda', presentation: 'modal' }}
        />
        <Stack.Screen
          name="session/create"
          options={{ title: 'Pianifica Sessione', presentation: 'modal' }}
        />
        <Stack.Screen
          name="session/active/[id]"
          options={{ title: 'Allenamento Attivo', presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="goal/create"
          options={{ title: 'Nuovo Obiettivo', presentation: 'modal' }}
        />
        <Stack.Screen
          name="goal/edit/[id]"
          options={{ title: 'Modifica Obiettivo', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}