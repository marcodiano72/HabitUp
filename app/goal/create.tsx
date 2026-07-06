// app/goal/create.tsx — Crea Obiettivo
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useGoalStore } from '../../store/goalStore';
import { Goal } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { getLocalDateString } from '../../utils/date';


const CATEGORIES = ['Forza', 'Ipertrofia', 'Resistenza', 'Peso corporeo', 'Frequenza', 'Flessibilità'];

export default function CreateGoalScreen() {
  const router = useRouter();
  const addGoal = useGoalStore((s) => s.addGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Forza');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [endDate, setEndDate] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Errore', 'Inserisci il titolo.'); return; }
    if (!targetValue || isNaN(parseFloat(targetValue))) { Alert.alert('Errore', 'Inserisci un valore target numerico.'); return; }
    const goal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue) || 0,
      startDate: getLocalDateString(),
      endDate: endDate.trim() || undefined,
      status: 'Attivo',
    };
    await addGoal(goal);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Nuovo Obiettivo', headerBackTitle: 'back' }} />

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Titolo *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="es. Arrivare a 100kg squat" placeholderTextColor={Colors.textMuted} />
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
          <Text style={styles.label}>Valore target *</Text>
          <TextInput style={styles.input} value={targetValue} onChangeText={setTargetValue} keyboardType="decimal-pad" placeholder="es. 100" placeholderTextColor={Colors.textMuted} />
        </View>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Valore attuale</Text>
          <TextInput style={styles.input} value={currentValue} onChangeText={setCurrentValue} keyboardType="decimal-pad" placeholder="es. 80" placeholderTextColor={Colors.textMuted} />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Scadenza (AAAA-MM-GG)</Text>
        <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Opzionale" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Descrizione</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholder="Spiega il tuo obiettivo..." placeholderTextColor={Colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Aggiungi Obiettivo</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
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
  saveBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', ...Shadow.md },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
});
