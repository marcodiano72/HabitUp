// app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { useExerciseStore } from '../store/exerciseStore';
import { useGoalStore } from '../store/goalStore';
import { useHistoryStore } from '../store/historyStore';
import { useSessionStore } from '../store/sessionStore';
import { useWorkoutPlanStore } from '../store/workoutPlanStore';

export default function RootLayout() {
  const router = useRouter();
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
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#000000',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: Colors.background },
          headerBackTitle: 'back',
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 4,
                  paddingRight: 10,
                  paddingVertical: 5,
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#000000" />
                <Text style={{ fontSize: 16, color: '#000000', marginLeft: -4 }}>Back</Text>
              </TouchableOpacity>
            ) : undefined,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: 'back' }} />
        <Stack.Screen
          name="exercise/[id]"
          options={{ title: 'Dettaglio Esercizio', presentation: 'card', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="exercise/create"
          options={{ title: 'Nuovo Esercizio', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="exercise/edit/[id]"
          options={{ title: 'Modifica Esercizio', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="plan/[id]"
          options={{ title: 'Dettaglio Scheda', presentation: 'card', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="plan/create"
          options={{ title: 'Nuova Scheda', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="plan/edit/[id]"
          options={{ title: 'Modifica Scheda', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="session/create"
          options={{ title: 'Pianifica Sessione', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="session/list"
          options={{ title: 'Agenda Sessioni', presentation: 'card', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="session/edit/[id]"
          options={{ title: 'Modifica Sessione', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="session/active/[id]"
          options={{ title: 'Allenamento Attivo', presentation: 'fullScreenModal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="history/edit/[id]"
          options={{ title: 'Modifica Allenamento', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="goal/create"
          options={{ title: 'Nuovo Obiettivo', presentation: 'modal', headerBackTitle: 'back' }}
        />
        <Stack.Screen
          name="goal/edit/[id]"
          options={{ title: 'Modifica Obiettivo', presentation: 'modal', headerBackTitle: 'back' }}
        />
      </Stack>
    </>
  );
}