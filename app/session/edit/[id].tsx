// app/session/edit/[id].tsx — Modifica Sessione Pianificata
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSessionStore } from '../../../store/sessionStore';
import { useWorkoutPlanStore } from '../../../store/workoutPlanStore';
import { PlannedSession } from '../../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../../constants/theme';

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const updateSession = useSessionStore((s) => s.updateSession);
  const plans = useWorkoutPlanStore((s) => s.plans);

  const session = sessions.find((s) => s.id === id);

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (session) {
      setSelectedPlanId(session.planId);
      setDate(session.scheduledDate);
      setNotes(session.notes ?? '');
    }
  }, [session]);

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen options={{ title: 'Errore', headerBackTitleVisible: false } as any} />
        <Text style={{ color: Colors.danger }}>Sessione non trovata</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>← Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (!selectedPlanId) { Alert.alert('Errore', 'Seleziona una scheda.'); return; }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Errore', 'Formato data non valido. Usa AAAA-MM-GG.');
      return;
    }

    const updated: PlannedSession = {
      ...session,
      planId: selectedPlanId,
      scheduledDate: date,
      notes: notes.trim() || undefined,
    };
    await updateSession(updated);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Modifica Sessione', headerBackTitle: 'back' }} />

      {/* Selezione scheda */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Scheda *</Text>
        {plans.length === 0 ? (
          <View style={styles.noPlansBox}>
            <Ionicons name="warning-outline" size={24} color={Colors.warning} />
            <Text style={styles.noPlansText}>Nessuna scheda disponibile.</Text>
          </View>
        ) : (
          plans.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.planRow, selectedPlanId === p.id && styles.planRowActive]}
              onPress={() => setSelectedPlanId(p.id)}
            >
              <View style={styles.planRowLeft}>
                <Text style={[styles.planName, selectedPlanId === p.id && { color: Colors.primary }]}>
                  {p.name}
                </Text>
                <Text style={styles.planMeta}>{p.exercises.length} esercizi · {p.expectedDuration} min</Text>
              </View>
              {selectedPlanId === p.id && (
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Data */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Data (AAAA-MM-GG) *</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-07-10"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      {/* Note */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Informazioni aggiuntive..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveBtnText}>Salva Modifiche</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  fieldGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  textArea: { height: 80, textAlignVertical: 'top' },
  planRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  planRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight + '11' },
  planRowLeft: { flex: 1 },
  planName: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  planMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  noPlansBox: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg, gap: 8, borderWidth: 1, borderColor: Colors.border },
  noPlansText: { color: Colors.textSecondary, fontSize: FontSize.md },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, ...Shadow.md },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
});
