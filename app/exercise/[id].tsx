// app/exercise/[id].tsx — Dettaglio Esercizio
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseStore } from '../../store/exerciseStore';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';

const COLORE_DIFFICOLTA: Record<string, string> = {
  Principiante: Colors.beginner,
  Intermedio: Colors.intermediate,
  Avanzato: Colors.advanced,
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const exercises = useExerciseStore((s) => s.exercises);
  const deleteExercise = useExerciseStore((s) => s.deleteExercise);
  const esercizio = exercises.find((e) => e.id === id);

  if (!esercizio) {
    return (
      <View style={styles.contenitore}>
        <Stack.Screen options={{ title: 'Errore', headerBackTitle: 'back' }} />
        <Text style={styles.testoErrore}>Esercizio non trovato!</Text>
      </View>
    );
  }

  const handleElimina = () => {
    Alert.alert(
      'Elimina Esercizio',
      `Vuoi eliminare "${esercizio.name}"? L'azione è irreversibile.`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            await deleteExercise(esercizio.id);
            router.back();
          },
        },
      ]
    );
  };

  const coloreDifficolta = COLORE_DIFFICOLTA[esercizio.difficulty] ?? Colors.primary;

  return (
    <ScrollView style={styles.contenitore} contentContainerStyle={styles.contenuto}>
      <Stack.Screen
        options={{
          title: esercizio.name.length > 22 ? esercizio.name.slice(0, 19) + '...' : esercizio.name,
          headerBackTitle: 'back',
          headerTitleStyle: { fontSize: 16 },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/exercise/edit/[id]', params: { id: esercizio.id } })}
              style={{ marginRight: 8 }}
            >
              <Ionicons name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Sezione hero */}
      <View style={styles.sezioneHero}>
        <View style={styles.iconaHero}>
          <Ionicons name="barbell" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.titoloHero}>{esercizio.name}</Text>
        <View style={[styles.etichettaDifficolta, { backgroundColor: coloreDifficolta + '22' }]}>
          <Text style={[styles.testoDifficolta, { color: coloreDifficolta }]}>{esercizio.difficulty}</Text>
        </View>
      </View>

      {/* Griglia informazioni */}
      <View style={styles.grigliaInfo}>
        <View style={styles.cardInfo}>
          <Ionicons name="body-outline" size={18} color={Colors.primary} />
          <Text style={styles.etichettaInfo}>Muscolo principale</Text>
          <Text style={styles.valoreInfo}>{esercizio.primaryMuscle}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="fitness-outline" size={18} color={Colors.accent} />
          <Text style={styles.etichettaInfo}>Attrezzatura</Text>
          <Text style={styles.valoreInfo}>{esercizio.equipment}</Text>
        </View>
      </View>

      {esercizio.description ? (
        <View style={styles.sezione}>
          <Text style={styles.titoloSezione}>Descrizione</Text>
          <Text style={styles.testoSezione}>{esercizio.description}</Text>
        </View>
      ) : null}

      {esercizio.secondaryMuscles.length > 0 && (
        <View style={styles.sezione}>
          <Text style={styles.titoloSezione}>Muscoli secondari</Text>
          <View style={styles.rigaChip}>
            {esercizio.secondaryMuscles.map((muscolo) => (
              <View key={muscolo} style={styles.chip}>
                <Text style={styles.testoChip}>{muscolo}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {esercizio.notes ? (
        <View style={styles.sezione}>
          <Text style={styles.titoloSezione}>Note</Text>
          <Text style={styles.testoSezione}>{esercizio.notes}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.pulsanteModifica}
        onPress={() => router.push({ pathname: '/exercise/edit/[id]', params: { id: esercizio.id } })}
      >
        <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
        <Text style={styles.testoPulsanteModifica}>Modifica esercizio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pulsanteElimina} onPress={handleElimina}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.testoPulsanteElimina}>Elimina esercizio</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenuto: { padding: Spacing.md },
  testoErrore: { color: Colors.danger, fontSize: FontSize.lg, textAlign: 'center', marginTop: 40 },

  sezioneHero: { alignItems: 'center', marginBottom: Spacing.lg },
  iconaHero: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: Colors.primary + '44' },
  titoloHero: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', marginBottom: 10 },
  etichettaDifficolta: { paddingVertical: 5, paddingHorizontal: 16, borderRadius: Radius.full },
  testoDifficolta: { fontSize: FontSize.sm, fontWeight: '700' },

  grigliaInfo: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  cardInfo: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border },
  etichettaInfo: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  valoreInfo: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center' },

  sezione: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  titoloSezione: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  testoSezione: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22 },

  rigaChip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: Colors.primaryLight + '22', borderRadius: Radius.full, paddingVertical: 5, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.primary + '44' },
  testoChip: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  pulsanteModifica: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.primary, marginTop: Spacing.md },
  testoPulsanteModifica: { color: Colors.primary, fontSize: FontSize.md, fontWeight: 'bold' },
  pulsanteElimina: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger },
  testoPulsanteElimina: { color: Colors.danger, fontSize: FontSize.md, fontWeight: 'bold' },
});