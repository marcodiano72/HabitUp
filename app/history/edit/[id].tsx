// app/history/edit/[id].tsx — Modifica Allenamento Registrato
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHistoryStore } from '../../../store/historyStore';
import { WorkoutSession } from '../../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../../constants/theme';

export default function EditHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const history = useHistoryStore((s) => s.history);
  const updateSession = useHistoryStore((s) => s.updateSession);

  const session = history.find((s) => s.id === id);

  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [fatigueLevel, setFatigueLevel] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setDuration(String(session.duration));
      setFatigueLevel(session.fatigueLevel);
      setNotes(session.notes ?? '');
    }
  }, [session]);

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen options={{ title: 'Errore', headerBackTitle: 'back' }} />
        <Text style={{ color: Colors.danger }}>Allenamento non trovato nello storico</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>← Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (!date) { Alert.alert('Errore', 'Inserisci la data.'); return; }
    const min = parseInt(duration);
    if (isNaN(min) || min <= 0) { Alert.alert('Errore', 'Inserisci una durata valida.'); return; }

    const updated: WorkoutSession = {
      ...session,
      date,
      duration: min,
      fatigueLevel,
      notes: notes.trim() || undefined,
    };

    await updateSession(updated);
    Alert.alert('Salvo', 'I dettagli dell\'allenamento sono stati aggiornati.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Modifica Allenamento', headerBackTitle: 'back' }} />

      <Text style={styles.title}>{session.planName ?? 'Allenamento Libero'}</Text>
      <Text style={styles.subtitle}>{session.exercisesDone.length} esercizi svolti</Text>

      {/* Data */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Data e Ora (ISO)*</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-07-10T12:00:00.000Z"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Durata */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Durata (minuti) *</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="Durata in minuti"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* RPE */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Fatica percepita (RPE 1-10) *</Text>
        <View style={styles.rpeGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <TouchableOpacity
              key={n}
              style={[
                styles.rpeNum,
                fatigueLevel === n && styles.rpeNumSelected,
              ]}
              onPress={() => setFatigueLevel(n)}
            >
              <Text
                style={[
                  styles.rpeNumText,
                  fatigueLevel === n && { color: '#fff', fontWeight: 'bold' },
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Note */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Com'è andata la sessione..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveBtnText}>Aggiorna Allenamento</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  fieldGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  textArea: { height: 80, textAlignVertical: 'top' },
  rpeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 },
  rpeNum: { flex: 1, minWidth: 40, height: 40, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  rpeNumSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rpeNumText: { fontSize: FontSize.sm, color: Colors.textPrimary },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, ...Shadow.md },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
});
