// app/goal/edit/[id].tsx — Modifica Obiettivo con aggiornamento progresso
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoalStore } from '../../../store/goalStore';
import { GoalStatus } from '../../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../../constants/theme';

const CATEGORIES = ['Forza', 'Ipertrofia', 'Resistenza', 'Peso corporeo', 'Frequenza', 'Flessibilità'];
const STATUSES: GoalStatus[] = ['Attivo', 'Completato', 'Abbandonato'];

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);

  const goal = goals.find((g) => g.id === id);

  const [title, setTitle] = useState(goal?.title ?? '');
  const [description, setDescription] = useState(goal?.description ?? '');
  const [category, setCategory] = useState(goal?.category ?? 'Forza');
  const [targetValue, setTargetValue] = useState(String(goal?.targetValue ?? ''));
  const [currentValue, setCurrentValue] = useState(String(goal?.currentValue ?? ''));
  const [endDate, setEndDate] = useState(goal?.endDate ?? '');
  const [status, setStatus] = useState<GoalStatus>(goal?.status ?? 'Attivo');

  if (!goal) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.danger }}>Obiettivo non trovato</Text>
      </View>
    );
  }

  const progress = Math.min((parseFloat(currentValue) || 0) / (parseFloat(targetValue) || 1), 1);

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Errore', 'Inserisci il titolo.'); return; }
    await updateGoal({
      ...goal,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      targetValue: parseFloat(targetValue) || goal.targetValue,
      currentValue: parseFloat(currentValue) || 0,
      endDate: endDate.trim() || undefined,
      status,
    });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Elimina Obiettivo', `Eliminare "${goal.title}"?`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => { await deleteGoal(goal.id); router.back(); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Modifica Obiettivo', headerBackTitle: 'back' }} />

      {/* Preview progresso */}
      <View style={styles.previewCard}>
        <Text style={styles.previewPct}>{Math.round(progress * 100)}%</Text>
        <View style={styles.previewTrack}>
          <View style={[styles.previewFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.previewValues}>{currentValue} / {targetValue}</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Titolo *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={Colors.textMuted} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipGrid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Target</Text>
          <TextInput style={styles.input} value={targetValue} onChangeText={setTargetValue} keyboardType="decimal-pad" placeholderTextColor={Colors.textMuted} />
        </View>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Progresso attuale</Text>
          <TextInput style={styles.input} value={currentValue} onChangeText={setCurrentValue} keyboardType="decimal-pad" placeholderTextColor={Colors.textMuted} />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Stato</Text>
        <View style={styles.optionRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity key={s} style={[styles.optionBtn, status === s && styles.optionBtnActive]} onPress={() => setStatus(s)}>
              <Text style={[styles.optionText, status === s && styles.optionTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Scadenza</Text>
        <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="AAAA-MM-GG" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Descrizione</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholderTextColor={Colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Salva Modifiche</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Elimina Obiettivo</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  previewCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  previewPct: { fontSize: FontSize.xxxl, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  previewTrack: { width: '100%', height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden', marginBottom: 6 },
  previewFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  previewValues: { fontSize: FontSize.sm, color: Colors.textSecondary },
  fieldGroup: { marginBottom: Spacing.md },
  rowFields: { flexDirection: 'row', gap: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  textArea: { height: 80, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, alignItems: 'center', backgroundColor: Colors.surface },
  optionBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  optionTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginBottom: 10, ...Shadow.md },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger },
  deleteBtnText: { color: Colors.danger, fontSize: FontSize.md, fontWeight: 'bold' },
});
