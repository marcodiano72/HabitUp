// app/(tabs)/exercises.tsx — Lista Esercizi con ricerca
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseStore } from '../../store/exerciseStore';
import { Exercise } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const DIFFICULTY_COLOR: Record<string, string> = {
  Principiante: Colors.beginner,
  Intermedio: Colors.intermediate,
  Avanzato: Colors.advanced,
};

const MUSCLE_GROUPS = [
  'Tutti', 'Pettorali', 'Dorsali', 'Spalle', 'Bicipiti', 'Tricipiti',
  'Quadricipiti', 'Glutei', 'Femorali', 'Core',
];

export default function ExercisesScreen() {
  const router = useRouter();
  const exercises = useExerciseStore((state) => state.exercises);
  const [search, setSearch] = useState('');
  const [filtroMuscolo, setFiltroMuscolo] = useState('Tutti');

  const eserciziFiltrati = useMemo(() => {
    return exercises.filter((e) => {
      const corrispondeRicerca =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.primaryMuscle.toLowerCase().includes(search.toLowerCase());
      const corrispondeFiltro =
        filtroMuscolo === 'Tutti' || e.primaryMuscle === filtroMuscolo;
      return corrispondeRicerca && corrispondeFiltro;
    });
  }, [exercises, search, filtroMuscolo]);

  const renderCardEsercizio = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.scheda}
      activeOpacity={0.75}
      onPress={() =>
        router.push({ pathname: '/exercise/[id]', params: { id: item.id } })
      }
    >
      <View style={styles.rigaSuperiore}>
        <View style={styles.icona}>
          <Ionicons name="barbell" size={20} color={Colors.primary} />
        </View>
        <View style={styles.infoEsercizio}>
          <Text style={styles.nomeEsercizio} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.muscoloPrincipale}>{item.primaryMuscle}</Text>
        </View>
        <View
          style={[
            styles.etichettaDifficolta,
            { backgroundColor: DIFFICULTY_COLOR[item.difficulty] + '22' },
          ]}
        >
          <Text
            style={[
              styles.testoDifficolta,
              { color: DIFFICULTY_COLOR[item.difficulty] },
            ]}
          >
            {item.difficulty}
          </Text>
        </View>
      </View>
      {item.description ? (
        <Text style={styles.descrizione} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      <View style={styles.rigaInferiore}>
        <Ionicons name="fitness-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.attrezzatura}>{item.equipment}</Text>
        {item.secondaryMuscles.length > 0 && (
          <>
            <Text style={styles.separatore}>·</Text>
            <Text style={styles.muscoliSecondari} numberOfLines={1}>
              {item.secondaryMuscles.join(', ')}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenitore}>
      {/* Barra di ricerca */}
      <View style={styles.barraDiRicerca}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.campoDiRicerca}
          placeholder="Cerca per nome o muscolo..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtri per gruppo muscolare */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={MUSCLE_GROUPS}
        keyExtractor={(item) => item}
        style={styles.rigaFiltri}
        contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chipFiltro,
              filtroMuscolo === item && styles.chipFiltroAttivo,
            ]}
            onPress={() => setFiltroMuscolo(item)}
          >
            <Text
              style={[
                styles.testoChipFiltro,
                filtroMuscolo === item && styles.testoChipFiltroAttivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Lista esercizi */}
      <FlatList
        data={eserciziFiltrati}
        keyExtractor={(item) => item.id}
        renderItem={renderCardEsercizio}
        contentContainerStyle={styles.contenutoLista}
        ListEmptyComponent={
          <View style={styles.statoVuoto}>
            <Ionicons name="barbell-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.testoStatoVuoto}>Nessun esercizio trovato</Text>
          </View>
        }
      />

      {/* Pulsante aggiungi */}
      <TouchableOpacity
        style={styles.pulisanteFlottante}
        onPress={() => router.push('/exercise/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },

  barraDiRicerca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  campoDiRicerca: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  rigaFiltri: {
    flexGrow: 0,
    marginBottom: Spacing.sm,
  },
  chipFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipFiltroAttivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  testoChipFiltro: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  testoChipFiltroAttivo: { color: '#fff' },

  contenutoLista: { padding: Spacing.md, gap: 12, paddingBottom: 100 },

  scheda: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  rigaSuperiore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  icona: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoEsercizio: { flex: 1 },
  nomeEsercizio: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  muscoloPrincipale: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: 2,
  },
  etichettaDifficolta: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
  },
  testoDifficolta: { fontSize: FontSize.xs, fontWeight: '700' },

  descrizione: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },

  rigaInferiore: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attrezzatura: { fontSize: FontSize.xs, color: Colors.textMuted },
  separatore: { fontSize: FontSize.xs, color: Colors.textMuted },
  muscoliSecondari: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },

  statoVuoto: { alignItems: 'center', marginTop: 60, gap: 12 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md },

  pulisanteFlottante: {
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