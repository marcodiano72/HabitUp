// app/exercise/edit/[id].tsx — Modifica Esercizio
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useExerciseStore } from '../../../store/exerciseStore';
import { Difficulty } from '../../../models/types';
import { Colors, Spacing, Radius, FontSize } from '../../../constants/theme';

const LIVELLI_DIFFICOLTA: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzato'];
const OPZIONI_ATTREZZATURA = [
  'Corpo libero', 'Bilanciere', 'Manubri', 'Kettlebell',
  'Cavi', 'Macchinario', 'Sbarra', 'Elastici', 'Altro',
];

export default function EditExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const exercises = useExerciseStore((s) => s.exercises);
  const updateExercise = useExerciseStore((s) => s.updateExercise);
  const esercizio = exercises.find((e) => e.id === id);

  const [nome, setNome] = useState(esercizio?.name ?? '');
  const [muscoloPrincipale, setMuscoloPrincipale] = useState(esercizio?.primaryMuscle ?? '');
  const [muscoliSecondari, setMuscoliSecondari] = useState(esercizio?.secondaryMuscles.join(', ') ?? '');
  const [attrezzatura, setAttrezzatura] = useState(esercizio?.equipment ?? 'Corpo libero');
  const [descrizione, setDescrizione] = useState(esercizio?.description ?? '');
  const [difficolta, setDifficolta] = useState<Difficulty>(esercizio?.difficulty ?? 'Principiante');
  const [note, setNote] = useState(esercizio?.notes ?? '');

  if (!esercizio) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Colors.danger }}>Esercizio non trovato</Text>
      </View>
    );
  }

  const handleSalva = async () => {
    if (!nome.trim() || !muscoloPrincipale.trim()) {
      Alert.alert('Errore', 'Nome e Gruppo Muscolare sono obbligatori.');
      return;
    }
    await updateExercise({
      ...esercizio,
      name: nome.trim(),
      primaryMuscle: muscoloPrincipale.trim(),
      secondaryMuscles: muscoliSecondari.split(',').map((s) => s.trim()).filter(Boolean),
      equipment: attrezzatura,
      description: descrizione.trim(),
      difficulty: difficolta,
      notes: note.trim() || undefined,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.contenitore} contentContainerStyle={styles.contenuto}>
      <Stack.Screen options={{ title: 'Modifica Esercizio' }} />

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Nome Esercizio *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholderTextColor={Colors.textMuted} />
      </View>
      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Gruppo Muscolare Principale *</Text>
        <TextInput style={styles.input} value={muscoloPrincipale} onChangeText={setMuscoloPrincipale} placeholderTextColor={Colors.textMuted} />
      </View>
      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Muscoli Secondari</Text>
        <TextInput style={styles.input} value={muscoliSecondari} onChangeText={setMuscoliSecondari} placeholderTextColor={Colors.textMuted} placeholder="separati da virgola" />
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Difficoltà</Text>
        <View style={styles.rigaOpzioni}>
          {LIVELLI_DIFFICOLTA.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.pulsanteOpzione, difficolta === d && styles.pulsanteOpzioneAttivo]}
              onPress={() => setDifficolta(d)}
            >
              <Text style={[styles.testoPulsanteOpzione, difficolta === d && styles.testoPulsanteOpzioneAttivo]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Attrezzatura</Text>
        <View style={styles.grigliaAttrezzatura}>
          {OPZIONI_ATTREZZATURA.map((eq) => (
            <TouchableOpacity
              key={eq}
              style={[styles.chipAttrezzatura, attrezzatura === eq && styles.chipAttrezzaturaSelezionato]}
              onPress={() => setAttrezzatura(eq)}
            >
              <Text style={[styles.testoChipAttrezzatura, attrezzatura === eq && styles.testoChipAttrezzaturaSelezionato]}>{eq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Descrizione</Text>
        <TextInput style={[styles.input, styles.areaTestuale]} value={descrizione} onChangeText={setDescrizione} multiline numberOfLines={3} placeholderTextColor={Colors.textMuted} />
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Note</Text>
        <TextInput style={[styles.input, styles.areaTestuale]} value={note} onChangeText={setNote} multiline numberOfLines={3} placeholderTextColor={Colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.pulsanteSalva} onPress={handleSalva}>
        <Text style={styles.testoPulsanteSalva}>Salva Modifiche</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenuto: { padding: Spacing.md },
  gruppoCampo: { marginBottom: Spacing.md },
  etichetta: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  areaTestuale: { height: 90, textAlignVertical: 'top' },
  rigaOpzioni: { flexDirection: 'row', gap: 8 },
  pulsanteOpzione: { flex: 1, padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, alignItems: 'center', backgroundColor: Colors.surface },
  pulsanteOpzioneAttivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoPulsanteOpzione: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  testoPulsanteOpzioneAttivo: { color: '#fff' },
  grigliaAttrezzatura: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipAttrezzatura: { paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, backgroundColor: Colors.surface },
  chipAttrezzaturaSelezionato: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoChipAttrezzatura: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  testoChipAttrezzaturaSelezionato: { color: '#fff' },
  pulsanteSalva: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginTop: Spacing.md },
  testoPulsanteSalva: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
});
