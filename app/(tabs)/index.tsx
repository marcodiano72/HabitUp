// app/(tabs)/index.tsx — Dashboard Home
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';
import { useGoalStore } from '../../store/goalStore';
import { useSessionStore } from '../../store/sessionStore';
import { useWorkoutPlanStore } from '../../store/workoutPlanStore';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const history = useHistoryStore((s) => s.history);
  const goals = useGoalStore((s) => s.goals);
  const sessions = useSessionStore((s) => s.sessions);
  const plans = useWorkoutPlanStore((s) => s.plans);

  // Statistiche veloci
  const totalWorkouts = history.length;
  const activeGoals = goals.filter((g) => g.status === 'Attivo').length;

  // Sessione pianificata oggi
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySession = sessions.find(
    (s) => s.scheduledDate === todayStr && s.status === 'planned'
  );
  const todayPlan = todaySession
    ? plans.find((p) => p.id === todaySession.planId)
    : null;

  // Ultimo allenamento
  const lastWorkout = history.length > 0 ? history[0] : null;

  // Calcolo frequenza settimanale
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyCount = history.filter(
    (s) => new Date(s.date) >= oneWeekAgo
  ).length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno 🌅';
    if (h < 18) return 'Buon pomeriggio ☀️';
    return 'Buonasera 🌙';
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.title}>Fitness Tracker</Text>
      </View>

      {/* Sessione di oggi */}
      {todayPlan ? (
        <TouchableOpacity
          style={styles.todayCard}
          onPress={() =>
            router.push({
              pathname: '/session/active/[id]',
              params: { id: todaySession!.id },
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.todayHeader}>
            <Ionicons name="flash" size={20} color={Colors.primary} />
            <Text style={styles.todayLabel}>Allenamento di oggi</Text>
          </View>
          <Text style={styles.todayPlanName}>{todayPlan.name}</Text>
          <Text style={styles.todayMeta}>
            {todayPlan.expectedDuration} min · {todayPlan.exercises.length} esercizi
          </Text>
          <View style={styles.startBtn}>
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.startBtnText}>Inizia ora</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.emptyTodayCard}
          onPress={() => router.push('/session/create')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyTodayText}>Nessun allenamento pianificato</Text>
          <Text style={styles.emptyTodaySubText}>Tocca per pianificarne uno</Text>
        </TouchableOpacity>
      )}

      {/* Stats cards */}
      <Text style={styles.sectionTitle}>Le tue statistiche</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: Colors.primary }]}>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Allenamenti totali</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.success }]}>
          <Text style={styles.statValue}>{weeklyCount}</Text>
          <Text style={styles.statLabel}>Questa settimana</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.warning }]}>
          <Text style={styles.statValue}>{activeGoals}</Text>
          <Text style={styles.statLabel}>Obiettivi attivi</Text>
        </View>
      </View>

      {/* Ultimo allenamento */}
      {lastWorkout && (
        <>
          <Text style={styles.sectionTitle}>Ultimo allenamento</Text>
          <View style={styles.lastWorkoutCard}>
            <View style={styles.lastWorkoutHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.lastWorkoutName}>
                {lastWorkout.planName ?? 'Allenamento libero'}
              </Text>
            </View>
            <Text style={styles.lastWorkoutMeta}>
              {new Date(lastWorkout.date).toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <View style={styles.lastWorkoutStats}>
              <View style={styles.lastWorkoutStat}>
                <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.lastWorkoutStatText}>{lastWorkout.duration} min</Text>
              </View>
              <View style={styles.lastWorkoutStat}>
                <Ionicons name="battery-half-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.lastWorkoutStatText}>
                  RPE {lastWorkout.fatigueLevel}/10
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Azioni rapide</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/exercise/create')}
        >
          <Ionicons name="barbell-outline" size={22} color={Colors.primary} />
          <Text style={styles.quickBtnText}>Esercizio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/plan/create')}
        >
          <Ionicons name="clipboard-outline" size={22} color={Colors.accent} />
          <Text style={styles.quickBtnText}>Scheda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/session/create')}
        >
          <Ionicons name="calendar-outline" size={22} color={Colors.success} />
          <Text style={styles.quickBtnText}>Sessione</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/goal/create')}
        >
          <Ionicons name="trophy-outline" size={22} color={Colors.warning} />
          <Text style={styles.quickBtnText}>Obiettivo</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  header: { marginBottom: Spacing.lg, paddingTop: Spacing.sm },
  greeting: { fontSize: FontSize.md, color: Colors.textSecondary },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Today card
  todayCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadow.md,
  },
  todayHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  todayLabel: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  todayPlanName: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  todayMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 16 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    gap: 6,
  },
  startBtnText: { color: '#fff', fontWeight: 'bold', fontSize: FontSize.md },

  emptyTodayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyTodayText: { color: Colors.textSecondary, fontWeight: '600', marginTop: 10 },
  emptyTodaySubText: { color: Colors.textMuted, fontSize: FontSize.sm, marginTop: 4 },

  // Section title
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },

  // Last workout
  lastWorkoutCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lastWorkoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  lastWorkoutName: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  lastWorkoutMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 10 },
  lastWorkoutStats: { flexDirection: 'row', gap: Spacing.lg },
  lastWorkoutStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lastWorkoutStatText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickBtnText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
});