// app/(tabs)/exercises.tsx — Lista Esercizi con ricerca e filtri avanzati
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
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

const DIFFICOLTA_FILTRI = ['Tutti', 'Principiante', 'Intermedio', 'Avanzato'];
const ATTREZZATURA_FILTRI = ['Tutti', 'Corpo Libero', 'Manubri', 'Bilanciere', 'Macchine', 'Elastici', 'Panca'];

export default function ExercisesScreen() {
  const router = useRouter();
  const exercises = useExerciseStore((state) => state.exercises);
  const [search, setSearch] = useState('');
  const [filtroMuscolo, setFiltroMuscolo] = useState('Tutti');
  const [filtroDifficolta, setFiltroDifficolta] = useState('Tutti');
  const [filtroAttrezzatura, setFiltroAttrezzatura] = useState('Tutti');
  const [mostraFiltri, setMostraFiltri] = useState(false);

  const eserciziFiltrati = useMemo(() => {
    return exercises.filter((e) => {
      const corrispondeRicerca =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.primaryMuscle.toLowerCase().includes(search.toLowerCase());
      
      const corrispondeFiltroMuscolo =
        filtroMuscolo === 'Tutti' || e.primaryMuscle === filtroMuscolo;
      
      const corrispondeFiltroDifficolta =
        filtroDifficolta === 'Tutti' || e.difficulty === filtroDifficolta;
      
      const corrispondeFiltroAttrezzatura =
        filtroAttrezzatura === 'Tutti' ||
        e.equipment.toLowerCase().includes(filtroAttrezzatura.toLowerCase()) ||
        (filtroAttrezzatura === 'Corpo Libero' && (e.equipment === 'Nessuna' || e.equipment.toLowerCase().includes('corpo libero')));

      return corrispondeRicerca && corrispondeFiltroMuscolo && corrispondeFiltroDifficolta && corrispondeFiltroAttrezzatura;
    });
  }, [exercises, search, filtroMuscolo, filtroDifficolta, filtroAttrezzatura]);

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

  const haFiltriAttivi = filtroMuscolo !== 'Tutti' || filtroDifficolta !== 'Tutti' || filtroAttrezzatura !== 'Tutti';

  return (
    <View style={styles.contenitore}>
      {/* Barra di ricerca e Toggle Filtri */}
      <View style={styles.rigaRicercaEBottoni}>
        <View style={styles.barraDiRicerca}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.campoDiRicerca}
            placeholder="Cerca esercizio o muscolo..."
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
        <TouchableOpacity
          style={[styles.bottoneFiltri, (mostraFiltri || haFiltriAttivi) && styles.bottoneFiltriAttivo]}
          onPress={() => setMostraFiltri(!mostraFiltri)}
        >
          <Ionicons name="funnel-outline" size={20} color={mostraFiltri || haFiltriAttivi ? '#fff' : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Pannello Filtri Espandibile */}
      {mostraFiltri && (
        <View style={styles.pannelloFiltri}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 180 }}>
            {/* Gruppo Muscolare */}
            <Text style={styles.etichettaSezioneFiltri}>Gruppo Muscolare</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
              {MUSCLE_GROUPS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chipFiltro, filtroMuscolo === item && styles.chipFiltroAttivo]}
                  onPress={() => setFiltroMuscolo(item)}
                >
                  <Text style={[styles.testoChipFiltro, filtroMuscolo === item && styles.testoChipFiltroAttivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Difficoltà */}
            <Text style={styles.etichettaSezioneFiltri}>Difficoltà</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
              {DIFFICOLTA_FILTRI.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chipFiltro, filtroDifficolta === item && styles.chipFiltroAttivo]}
                  onPress={() => setFiltroDifficolta(item)}
                >
                  <Text style={[styles.testoChipFiltro, filtroDifficolta === item && styles.testoChipFiltroAttivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Attrezzatura */}
            <Text style={styles.etichettaSezioneFiltri}>Attrezzatura</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
              {ATTREZZATURA_FILTRI.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chipFiltro, filtroAttrezzatura === item && styles.chipFiltroAttivo]}
                  onPress={() => setFiltroAttrezzatura(item)}
                >
                  <Text style={[styles.testoChipFiltro, filtroAttrezzatura === item && styles.testoChipFiltroAttivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>

          {/* Reset button */}
          {haFiltriAttivi && (
            <TouchableOpacity
              style={styles.pulsanteReset}
              onPress={() => {
                setFiltroMuscolo('Tutti');
                setFiltroDifficolta('Tutti');
                setFiltroAttrezzatura('Tutti');
              }}
            >
              <Text style={styles.testoReset}>Resetta Filtri</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
            <Text style={styles.sottotestoStatoVuoto}>Prova ad allentare i filtri di ricerca</Text>
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
  rigaRicercaEBottoni: { flexDirection: 'row', padding: Spacing.md, paddingBottom: Spacing.sm, gap: Spacing.sm, alignItems: 'center' },
  barraDiRicerca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  campoDiRicerca: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  bottoneFiltri: {
    backgroundColor: Colors.surface,
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottoneFiltriAttivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pannelloFiltri: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  etichettaSezioneFiltri: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  scrollFiltriRow: {
    gap: 6,
    paddingBottom: Spacing.xs,
  },
  chipFiltro: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipFiltroAttivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  testoChipFiltro: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  testoChipFiltroAttivo: { color: '#fff' },
  pulsanteReset: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Colors.danger + '15',
  },
  testoReset: {
    color: Colors.danger,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
  },

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

  statoVuoto: { alignItems: 'center', marginTop: 60, gap: 8 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.xs },

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