// app/(tabs)/index.tsx — Dashboard Home (Light Mode Premium)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
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

  // Stats
  const totalWorkouts = history.length;
  const activeGoals = goals.filter((g) => g.status === 'Attivo').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySession = sessions.find((s) => s.scheduledDate === todayStr && s.status === 'planned');
  const todayPlan = todaySession ? plans.find((p) => p.id === todaySession.planId) : null;

  const lastWorkout = history.length > 0 ? history[0] : null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno';
    if (h < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  })();

  const d = new Date();
  const todayFormatted = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Intestazione Dashboard */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, Atleta! 👋</Text>
          <Text style={styles.date}>{todayFormatted}</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-circle" size={48} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Hero Card: Prossimo Allenamento */}
      <Text style={styles.sectionTitle}>In programma oggi</Text>
      {todayPlan ? (
        <TouchableOpacity
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/session/active/[id]', params: { id: todaySession!.id } })}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PRONTO</Text>
            </View>
            <Text style={styles.heroTitle}>{todayPlan.name}</Text>
            <Text style={styles.heroSub}>{todayPlan.expectedDuration} min • {todayPlan.exercises.length} esercizi</Text>
          </View>
          <View style={styles.heroPlayBtn}>
            <Ionicons name="play" size={24} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.heroEmptyCard}
          activeOpacity={0.8}
          onPress={() => router.push('/session/create')}
        >
          <View style={styles.heroEmptyIcon}>
            <Ionicons name="calendar-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroEmptyTitle}>Giorno di riposo?</Text>
          <Text style={styles.heroEmptySub}>Tocca per pianificare un allenamento</Text>
        </TouchableOpacity>
      )}

      {/* Azioni Rapide Circolari */}
      <View style={styles.quickActionsGrid}>
        <QuickAction icon="barbell" label="Esercizi" color={Colors.accent} onPress={() => router.push('/exercise/create')} />
        <QuickAction icon="document-text" label="Schede" color={Colors.warning} onPress={() => router.push('/plan/create')} />
        <QuickAction icon="calendar" label="Pianifica" color={Colors.success} onPress={() => router.push('/session/create')} />
        <QuickAction icon="trophy" label="Obiettivi" color={Colors.danger} onPress={() => router.push('/goal/create')} />
      </View>

      {/* Riepilogo e Statistiche */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrapper, { backgroundColor: Colors.primaryLight + '20' }]}>
            <Ionicons name="flame" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Sessioni Totali</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrapper, { backgroundColor: Colors.warning + '20' }]}>
            <Ionicons name="flag" size={24} color={Colors.warning} />
          </View>
          <Text style={styles.statValue}>{activeGoals}</Text>
          <Text style={styles.statLabel}>Obiettivi Attivi</Text>
        </View>
      </View>

      {/* Ultima Attività */}
      {lastWorkout && (
        <View style={styles.lastActivitySection}>
          <Text style={styles.sectionTitle}>Ultima Attività</Text>
          <View style={styles.lastActivityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{lastWorkout.planName ?? 'Allenamento Libero'}</Text>
              <Text style={styles.activityDate}>
                {new Date(lastWorkout.date).toLocaleDateString('it-IT')} • {lastWorkout.duration} min
              </Text>
            </View>
            <View style={styles.activityRpe}>
              <Text style={styles.activityRpeValue}>{lastWorkout.fatigueLevel}</Text>
              <Text style={styles.activityRpeLabel}>RPE</Text>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: any; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
      <View style={[styles.quickActionCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl, marginTop: Spacing.sm },
  greeting: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  date: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '500', marginTop: 2, textTransform: 'capitalize' },
  profileIcon: { ...Shadow.sm },

  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, letterSpacing: -0.3 },

  // Hero Card
  heroCard: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl, ...Shadow.lg },
  heroContent: { flex: 1 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 8 },
  heroBadgeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: 'bold', letterSpacing: 1 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroSub: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  heroPlayBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...Shadow.md },

  heroEmptyCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  heroEmptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroEmptyTitle: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  heroEmptySub: { fontSize: FontSize.sm, color: Colors.textSecondary },

  // Quick Actions
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl, paddingHorizontal: 4 },
  quickActionItem: { alignItems: 'center', width: '22%' },
  quickActionCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickActionLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },

  // Stats
  statsContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.border },
  statIconWrapper: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },

  // Last Activity
  lastActivitySection: { marginBottom: Spacing.md },
  lastActivityCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.border },
  activityIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  activityDate: { fontSize: FontSize.sm, color: Colors.textSecondary },
  activityRpe: { alignItems: 'center', paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: Colors.border },
  activityRpeValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  activityRpeLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
});