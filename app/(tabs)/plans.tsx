// app/(tabs)/plans.tsx — Lista Schede di Allenamento con Ricerca e Filtri
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
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

const OBIETTIVI = ['Tutti', 'Ipertrofia', 'Forza massimale', 'Resistenza', 'Dimagrimento', 'Condizionamento', 'Mobilità'];
const LIVELLI = ['Tutti', 'Principiante', 'Intermedio', 'Avanzato'];

export default function PlansScreen() {
  const router = useRouter();
  const plans = useWorkoutPlanStore((s) => s.plans);
  const deletePlan = useWorkoutPlanStore((s) => s.deletePlan);
  const duplicatePlan = useWorkoutPlanStore((s) => s.duplicatePlan);

  const [search, setSearch] = useState('');
  const [filtroObiettivo, setFiltroObiettivo] = useState('Tutti');
  const [filtroLivello, setFiltroLivello] = useState('Tutti');
  const [mostraFiltri, setMostraFiltri] = useState(false);

  const schedeFiltrate = useMemo(() => {
    return plans.filter((p) => {
      const corrispondeRicerca = p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      const corrispondeObiettivo = filtroObiettivo === 'Tutti' || p.goal === filtroObiettivo;
      const corrispondeLivello = filtroLivello === 'Tutti' || p.level === filtroLivello;
      return corrispondeRicerca && corrispondeObiettivo && corrispondeLivello;
    });
  }, [plans, search, filtroObiettivo, filtroLivello]);

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
        <View style={{ flex: 1 }}>
          <Text style={styles.nomeScheda} numberOfLines={1}>{item.name}</Text>
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
        onPress={() => router.push({ pathname: '/session/create', params: { planId: item.id } })}
      >
        <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
        <Text style={styles.testoPianificaSessione}>Pianifica sessione</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const haFiltriAttivi = filtroObiettivo !== 'Tutti' || filtroLivello !== 'Tutti';

  return (
    <View style={styles.contenitore}>
      {/* Ricerca e Filtri */}
      <View style={styles.rigaRicercaEBottoni}>
        <View style={styles.barraDiRicerca}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.campoDiRicerca}
            placeholder="Cerca scheda..."
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

      {/* Pannello filtri */}
      {mostraFiltri && (
        <View style={styles.pannelloFiltri}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 150 }}>
            {/* Obiettivo */}
            <Text style={styles.etichettaSezioneFiltri}>Obiettivo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
              {OBIETTIVI.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chipFiltro, filtroObiettivo === item && styles.chipFiltroAttivo]}
                  onPress={() => setFiltroObiettivo(item)}
                >
                  <Text style={[styles.testoChipFiltro, filtroObiettivo === item && styles.testoChipFiltroAttivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Livello */}
            <Text style={styles.etichettaSezioneFiltri}>Livello</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
              {LIVELLI.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chipFiltro, filtroLivello === item && styles.chipFiltroAttivo]}
                  onPress={() => setFiltroLivello(item)}
                >
                  <Text style={[styles.testoChipFiltro, filtroLivello === item && styles.testoChipFiltroAttivo]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>

          {haFiltriAttivi && (
            <TouchableOpacity
              style={styles.pulsanteReset}
              onPress={() => {
                setFiltroObiettivo('Tutti');
                setFiltroLivello('Tutti');
              }}
            >
              <Text style={styles.testoReset}>Resetta Filtri</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Lista Schede */}
      <FlatList
        data={schedeFiltrate}
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
            <Text style={styles.testoStatoVuoto}>Nessuna scheda trovata</Text>
            <Text style={styles.sottotestoStatoVuoto}>
              Prova a modificare i filtri o premi + per crearne una nuova
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
  scheda: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  intestazioneScheda: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  nomeScheda: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  obiettivoScheda: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 2, fontWeight: '600' },
  etichettaLivello: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: Radius.full },
  testoLivello: { fontSize: FontSize.xs, fontWeight: '700' },
  descrizione: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  rigaMetadati: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  elementoMetadato: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testoMetadato: { fontSize: FontSize.xs, color: Colors.textSecondary },
  pulsantePianificaSessione: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 8 },
  testoPianificaSessione: { fontSize: FontSize.xs, fontWeight: 'bold', color: Colors.primary },
  statoVuoto: { alignItems: 'center', marginTop: 80, gap: 12 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center', paddingHorizontal: 20 },
  pulsanteFlottante: { position: 'absolute', right: 20, bottom: 24, backgroundColor: Colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', ...Shadow.lg },
});