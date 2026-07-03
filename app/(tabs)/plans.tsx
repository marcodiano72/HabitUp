// app/(tabs)/plans.tsx — Lista Schede di Allenamento
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutPlanStore } from '../../store/workoutPlanStore';
import { WorkoutPlan } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const COLORE_LIVELLO: Record<string, string> = {
  Principiante: Colors.beginner,
  Intermedio: Colors.intermediate,
  Avanzato: Colors.advanced,
};

export default function PlansScreen() {
  const router = useRouter();
  const plans = useWorkoutPlanStore((s) => s.plans);
  const deletePlan = useWorkoutPlanStore((s) => s.deletePlan);
  const duplicatePlan = useWorkoutPlanStore((s) => s.duplicatePlan);

  const handlePressLungo = (piano: WorkoutPlan) => {
    Alert.alert(piano.name, 'Cosa vuoi fare?', [
      {
        text: '📋 Duplica scheda',
        onPress: () => duplicatePlan(piano.id),
      },
      {
        text: '✏️ Modifica',
        onPress: () =>
          router.push({ pathname: '/plan/edit/[id]', params: { id: piano.id } }),
      },
      {
        text: '🗑️ Elimina',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Elimina', `Eliminare "${piano.name}"?`, [
            { text: 'Annulla', style: 'cancel' },
            {
              text: 'Elimina',
              style: 'destructive',
              onPress: () => deletePlan(piano.id),
            },
          ]),
      },
      { text: 'Annulla', style: 'cancel' },
    ]);
  };

  const renderCardPiano = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity
      style={styles.scheda}
      activeOpacity={0.75}
      onPress={() =>
        router.push({ pathname: '/plan/[id]', params: { id: item.id } })
      }
      onLongPress={() => handlePressLungo(item)}
    >
      <View style={styles.intestazioneScheda}>
        <View>
          <Text style={styles.nomeScheda}>{item.name}</Text>
          <Text style={styles.obiettivoScheda}>{item.goal}</Text>
        </View>
        <View
          style={[
            styles.etichettaLivello,
            { backgroundColor: COLORE_LIVELLO[item.level] + '22' },
          ]}
        >
          <Text
            style={[
              styles.testoLivello,
              { color: COLORE_LIVELLO[item.level] },
            ]}
          >
            {item.level}
          </Text>
        </View>
      </View>

      {item.description ? (
        <Text style={styles.descrizione} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.rigaMetadati}>
        <View style={styles.elementoMetadato}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.testoMetadato}>{item.expectedDuration} min</Text>
        </View>
        <View style={styles.elementoMetadato}>
          <Ionicons name="barbell-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.testoMetadato}>{item.exercises.length} esercizi</Text>
        </View>
        {item.frequency ? (
          <View style={styles.elementoMetadato}>
            <Ionicons name="repeat-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.testoMetadato}>{item.frequency}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.pulsantePianificaSessione}
        onPress={() => router.push('/session/create')}
      >
        <Ionicons name="play-circle-outline" size={16} color={Colors.primary} />
        <Text style={styles.testoPianificaSessione}>Pianifica sessione</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenitore}>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={renderCardPiano}
        contentContainerStyle={styles.contenutoLista}
        ListEmptyComponent={
          <View style={styles.statoVuoto}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color={Colors.textMuted}
            />
            <Text style={styles.testoStatoVuoto}>Nessuna scheda creata</Text>
            <Text style={styles.sottotestoStatoVuoto}>
              Tocca + per creare la prima scheda
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.pulsanteFlottante}
        onPress={() => router.push('/plan/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenutoLista: { padding: Spacing.md, gap: 12, paddingBottom: 100 },

  scheda: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  intestazioneScheda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nomeScheda: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  obiettivoScheda: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 2,
  },
  etichettaLivello: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  testoLivello: { fontSize: FontSize.xs, fontWeight: '700' },

  descrizione: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },

  rigaMetadati: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  elementoMetadato: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testoMetadato: { fontSize: FontSize.sm, color: Colors.textSecondary },

  pulsantePianificaSessione: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  testoPianificaSessione: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  statoVuoto: { alignItems: 'center', marginTop: 80, gap: 12 },
  testoStatoVuoto: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.sm },

  pulsanteFlottante: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.lg,
  },
});