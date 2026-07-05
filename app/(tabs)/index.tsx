// app/(tabs)/index.tsx — Dashboard Home (Premium Theme Blue & Green)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View style={{ flex: 1, marginRight: Spacing.sm }}>
          <Text style={styles.greeting}>{greeting}, Atleta! 👋</Text>
          <Text style={styles.date}>{todayFormatted}</Text>
        </View>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoHeader}
          resizeMode="contain"
        />
      </View>

      {/* Hero Card: Prossimo Allenamento */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>In programma oggi</Text>
        <TouchableOpacity onPress={() => router.push('/session/list')}>
          <Text style={styles.viewAllText}>Vedi Agenda →</Text>
        </TouchableOpacity>
      </View>

      {todayPlan ? (
        <TouchableOpacity
          style={styles.heroCardContainer}
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/session/active/[id]', params: { id: todaySession!.id } })}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCardGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>PRONTO</Text>
              </View>
              <Text style={styles.heroTitle} numberOfLines={1}>{todayPlan.name}</Text>
              <Text style={styles.heroSub}>{todayPlan.expectedDuration} min • {todayPlan.exercises.length} esercizi</Text>
            </View>
            <View style={styles.heroPlayBtn}>
              <Ionicons name="play" size={24} color={Colors.primary} />
            </View>
          </LinearGradient>
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

      {/* Azioni Rapide */}
      <Text style={styles.sectionTitle}>Azioni rapide</Text>
      <View style={styles.quickActionsGrid}>
        <QuickAction icon="barbell" label="Nuovo Eserc." color={Colors.primary} onPress={() => router.push('/exercise/create')} />
        <QuickAction icon="document-text" label="Nuova Scheda" color={Colors.accent} onPress={() => router.push('/plan/create')} />
        <QuickAction icon="calendar" label="Pianifica" color={Colors.primary} onPress={() => router.push('/session/create')} />
        <QuickAction icon="trophy" label="Nuovo Obiett." color={Colors.accent} onPress={() => router.push('/goal/create')} />
      </View>

      {/* Riepilogo e Statistiche */}
      <Text style={styles.sectionTitle}>Panoramica</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrapper, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="flame" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Allenamenti Totali</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIconWrapper, { backgroundColor: Colors.success + '22' }]}>
            <Ionicons name="flag" size={24} color={Colors.accent} />
          </View>
          <Text style={styles.statValue}>{activeGoals}</Text>
          <Text style={styles.statLabel}>Obiettivi Attivi</Text>
        </View>
      </View>

      {/* Ultima Attività */}
      {lastWorkout && (
        <View style={styles.lastActivitySection}>
          <Text style={styles.sectionTitle}>Ultimo Allenamento</Text>
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
    <TouchableOpacity style={styles.quickActionItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.quickActionCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.quickActionLabel} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, marginTop: Spacing.sm },
  greeting: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  date: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500', marginTop: 2, textTransform: 'capitalize' },
  logoHeader: { width: 120, height: 120 },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  viewAllText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  // Hero Card Gradient
  heroCardContainer: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.lg, ...Shadow.md },
  heroCardGradient: { padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroContent: { flex: 1, marginRight: Spacing.md },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 8 },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { fontSize: FontSize.xl, fontWeight: '800', color: '#fff', marginBottom: 2 },
  heroSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  heroPlayBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...Shadow.sm },

  heroEmptyCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  heroEmptyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroEmptyTitle: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  heroEmptySub: { fontSize: FontSize.xs, color: Colors.textSecondary },

  // Quick Actions Grid
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  quickActionItem: { alignItems: 'center', width: '22%' },
  quickActionCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },

  // Stats
  statsContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.border },
  statIconWrapper: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  // Last Activity
  lastActivitySection: { marginBottom: Spacing.md },
  lastActivityCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.border },
  activityIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  activityDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  activityRpe: { alignItems: 'center', paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: Colors.border },
  activityRpeValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  activityRpeLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});