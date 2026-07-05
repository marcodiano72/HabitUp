// app/plan/[id].tsx — Dettaglio Scheda
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutPlanStore } from '../../store/workoutPlanStore';
import { useExerciseStore } from '../../store/exerciseStore';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plans = useWorkoutPlanStore((s) => s.plans);
  const deletePlan = useWorkoutPlanStore((s) => s.deletePlan);
  const duplicatePlan = useWorkoutPlanStore((s) => s.duplicatePlan);
  const exercises = useExerciseStore((s) => s.exercises);

  const piano = plans.find((p) => p.id === id);
  if (!piano) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.danger }}>Scheda non trovata</Text>
      </View>
    );
  }

  const handleElimina = () => {
    Alert.alert('Elimina Scheda', `Eliminare "${piano.name}"?`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => { await deletePlan(piano.id); router.back(); } },
    ]);
  };

  return (
    <ScrollView style={styles.contenitore} contentContainerStyle={styles.contenuto}>
      <Stack.Screen
        options={{
          title: piano.name,
          headerBackTitle: 'back',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push({ pathname: '/plan/edit/[id]', params: { id: piano.id } })} style={{ marginRight: 8 }}>
              <Ionicons name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.intestazione}>
        <Text style={styles.obiettivo}>{piano.goal}</Text>
        <View style={styles.rigaMetadati}>
          <View style={styles.elementoMetadato}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.testoMetadato}>{piano.expectedDuration} min</Text>
          </View>
          <View style={styles.elementoMetadato}>
            <Ionicons name="barbell-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.testoMetadato}>{piano.exercises.length} esercizi</Text>
          </View>
          {piano.frequency && (
            <View style={styles.elementoMetadato}>
              <Ionicons name="repeat-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.testoMetadato}>{piano.frequency}</Text>
            </View>
          )}
        </View>
        {piano.description ? <Text style={styles.descrizione}>{piano.description}</Text> : null}
      </View>

      <Text style={styles.titoloSezione}>Esercizi</Text>
      {piano.exercises
        .sort((a, b) => a.order - b.order)
        .map((esercizioScheda, indice) => {
          const esercizio = exercises.find((e) => e.id === esercizioScheda.exerciseId);
          return (
            <View key={`${esercizioScheda.exerciseId}-${indice}`} style={styles.rigaEsercizio}>
              <View style={styles.numerazioneEsercizio}>
                <Text style={styles.testoNumerazione}>{indice + 1}</Text>
              </View>
              <View style={styles.infoEsercizio}>
                <Text style={styles.nomeEsercizio}>{esercizio?.name ?? 'Esercizio rimosso'}</Text>
                <Text style={styles.dettagliEsercizio}>
                  {esercizioScheda.sets} serie × {esercizioScheda.reps} rip
                  {esercizioScheda.weight ? ` · ${esercizioScheda.weight}kg` : ''}
                  {' · '}{esercizioScheda.restTime}s recupero
                </Text>
              </View>
            </View>
          );
        })}

      {piano.notes ? (
        <View style={styles.sezioneNote}>
          <Text style={styles.titoloSezione}>Note</Text>
          <Text style={styles.testoNote}>{piano.notes}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.pulsantePrimario} onPress={() => router.push('/session/create')}>
        <Ionicons name="play-circle" size={20} color="#fff" />
        <Text style={styles.testoPulsantePrimario}>Pianifica sessione</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pulsanteSecondario} onPress={() => duplicatePlan(piano.id).then(() => router.back())}>
        <Ionicons name="copy-outline" size={18} color={Colors.primary} />
        <Text style={styles.testoPulsanteSecondario}>Duplica scheda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pulsanteElimina} onPress={handleElimina}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.testoPulsanteElimina}>Elimina scheda</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenuto: { padding: Spacing.md },
  intestazione: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  obiettivo: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  rigaMetadati: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  elementoMetadato: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testoMetadato: { fontSize: FontSize.sm, color: Colors.textSecondary },
  descrizione: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 20 },
  titoloSezione: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  rigaEsercizio: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  numerazioneEsercizio: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryLight + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '44' },
  testoNumerazione: { color: Colors.primary, fontWeight: 'bold', fontSize: FontSize.md },
  infoEsercizio: { flex: 1 },
  nomeEsercizio: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  dettagliEsercizio: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  sezioneNote: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  testoNote: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 20 },
  pulsantePrimario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 10, marginTop: Spacing.md, ...Shadow.md },
  testoPulsantePrimario: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
  pulsanteSecondario: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 10, borderWidth: 1, borderColor: Colors.primary },
  testoPulsanteSecondario: { color: Colors.primary, fontSize: FontSize.md, fontWeight: 'bold' },
  pulsanteElimina: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger },
  testoPulsanteElimina: { color: Colors.danger, fontSize: FontSize.md, fontWeight: 'bold' },
});
