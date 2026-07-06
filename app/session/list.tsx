// app/session/list.tsx — Gestione Agenda Sessioni
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSessionStore } from '../../store/sessionStore';
import { useWorkoutPlanStore } from '../../store/workoutPlanStore';
import { PlannedSession } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function SessionListScreen() {
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const deleteSession = useSessionStore((s) => s.deleteSession);
  const duplicateSession = useSessionStore((s) => s.duplicateSession);
  const markCompleted = useSessionStore((s) => s.markCompleted);
  const markSkipped = useSessionStore((s) => s.markSkipped);
  const updateSession = useSessionStore((s) => s.updateSession);
  const plans = useWorkoutPlanStore((s) => s.plans);

  const [activeTab, setActiveTab] = useState<'planned' | 'history'>('planned');

  const sessioniFiltrate = sessions.filter((s) => {
    if (activeTab === 'planned') {
      return s.status === 'planned';
    } else {
      return s.status === 'completed' || s.status === 'skipped';
    }
  }).sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));

  const getNomeScheda = (planId: string) => {
    return plans.find((p) => p.id === planId)?.name ?? 'Allenamento';
  };

  const handleElimina = (id: string) => {
    Alert.alert('Elimina Sessione', 'Sei sicuro di voler eliminare questa sessione pianificata?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: () => deleteSession(id) },
    ]);
  };

  const handleDuplica = async (id: string) => {
    await duplicateSession(id);
    Alert.alert('Sessione Duplicata', 'La sessione è stata copiata per la giornata di domani.');
  };

  const handleRipristina = async (session: PlannedSession) => {
    await updateSession({ ...session, status: 'planned' });
  };

  const renderCardSessione = ({ item }: { item: PlannedSession }) => {
    const data = new Date(item.scheduledDate);
    const dataFormattata = data.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.dateBadge, item.status === 'completed' && styles.dateBadgeSuccess, item.status === 'skipped' && styles.dateBadgeMuted]}>
              <Text style={[styles.dateBadgeText, (item.status === 'completed' || item.status === 'skipped') && { color: '#fff' }]}>
                {dataFormattata}
              </Text>
            </View>
            <View>
              <Text style={styles.planName}>{getNomeScheda(item.planId)}</Text>
              <Text style={styles.planDate}>{item.scheduledDate}</Text>
            </View>
          </View>
          <View style={styles.badgeStato}>
            {item.status === 'planned' && (
              <View style={[styles.badge, { backgroundColor: Colors.primaryLight + '22' }]}>
                <Text style={[styles.badgeText, { color: Colors.primary }]}>In programma</Text>
              </View>
            )}
            {item.status === 'completed' && (
              <View style={[styles.badge, { backgroundColor: Colors.success + '22' }]}>
                <Text style={[styles.badgeText, { color: Colors.success }]}>Completato</Text>
              </View>
            )}
            {item.status === 'skipped' && (
              <View style={[styles.badge, { backgroundColor: Colors.border }]}>
                <Text style={[styles.badgeText, { color: Colors.textMuted }]}>Saltato</Text>
              </View>
            )}
          </View>
        </View>

        {item.notes ? (
          <Text style={styles.notes}>&quot;{item.notes}&quot;</Text>
        ) : null}

        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsRow}
        >
          {item.status === 'planned' ? (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/session/active/[id]', params: { id: item.id } })}>
                <Ionicons name="play" size={16} color={Colors.primary} />
                <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Avvia</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => markCompleted(item.id)}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={[styles.actionBtnText, { color: Colors.success }]}>Completa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => markSkipped(item.id)}>
                <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                <Text style={[styles.actionBtnText, { color: Colors.textSecondary }]}>Salta</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleRipristina(item)}>
              <Ionicons name="refresh" size={16} color={Colors.accent} />
              <Text style={[styles.actionBtnText, { color: Colors.accent }]}>Ripristina</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={() => handleDuplica(item.id)}>
            <Ionicons name="copy-outline" size={18} color={Colors.accent} />
          </TouchableOpacity>

          {item.status === 'planned' && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/session/edit/[id]', params: { id: item.id } })}>
              <Ionicons name="pencil-outline" size={18} color={Colors.warning} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={() => handleElimina(item.id)}>
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Agenda Sessioni', headerBackTitle: 'back' }} />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'planned' && styles.tabActive]}
          onPress={() => setActiveTab('planned')}
        >
          <Text style={[styles.tabText, activeTab === 'planned' && styles.tabTextActive]}>Pianificate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Storico Agenda</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sessioniFiltrate}
        keyExtractor={(item) => item.id}
        renderItem={renderCardSessione}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nessuna sessione trovata</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/session/create')}>
              <Text style={styles.createBtnText}>Pianifica ora</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabsContainer: { flexDirection: 'row', backgroundColor: Colors.surface, padding: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.primaryLight + '15' },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: Colors.primary },
  listContent: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 40 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dateBadge: { width: 50, height: 50, borderRadius: Radius.sm, backgroundColor: Colors.primaryLight + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '22' },
  dateBadgeSuccess: { backgroundColor: Colors.success, borderColor: Colors.success },
  dateBadgeMuted: { backgroundColor: Colors.textMuted, borderColor: Colors.textMuted },
  dateBadgeText: { fontSize: FontSize.xs, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', textTransform: 'uppercase' },
  planName: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  planDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  badgeStato: { alignSelf: 'flex-start' },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: Radius.full },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  notes: { fontSize: FontSize.sm, color: Colors.textSecondary, fontStyle: 'italic', marginVertical: 8, paddingLeft: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background },
  actionBtnText: { fontSize: FontSize.xs, fontWeight: 'bold' },
  iconBtn: { width: 32, height: 32, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', marginTop: 100, gap: 12 },
  emptyText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textMuted },
  createBtn: { backgroundColor: Colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.md },
  createBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: 'bold' },
});
