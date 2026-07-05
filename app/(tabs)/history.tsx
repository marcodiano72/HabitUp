// app/(tabs)/history.tsx — Storico Allenamenti & Analisi Grafica
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { useHistoryStore } from '../../store/historyStore';
import { useExerciseStore } from '../../store/exerciseStore';
import { WorkoutSession } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import {
  calculateTotalMinutes,
  calculateAverageRPE,
  formatDurationChartData,
  formatRPEChartData,
  formatMuscleVolumeChartData,
} from '../../utils/statsHelpers';

const { width: screenWidth } = Dimensions.get('window');

const coloreAffaticamento = (livello: number) => {
  if (livello <= 3) return Colors.success;
  if (livello <= 6) return Colors.warning;
  return Colors.danger;
};

export default function HistoryScreen() {
  const router = useRouter();
  const history = useHistoryStore((s) => s.history);
  const deleteSession = useHistoryStore((s) => s.deleteSession);
  const exercises = useExerciseStore((s) => s.exercises);

  const [visualizzazione, setVisualizzazione] = useState<'lista' | 'grafici'>('lista');

  const handleElimina = (sessione: WorkoutSession) => {
    Alert.alert('Elimina sessione', 'Vuoi eliminare questo allenamento dallo storico?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: () => deleteSession(sessione.id) },
    ]);
  };

  const renderCardSessione = ({ item }: { item: WorkoutSession }) => {
    const data = new Date(item.date);
    const coloreRPE = coloreAffaticamento(item.fatigueLevel);
    return (
      <View style={styles.scheda}>
        <View style={styles.intestazioneScheda}>
          <View style={styles.bloccoData}>
            <Text style={styles.giorno}>{data.getDate()}</Text>
            <Text style={styles.mese}>{data.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase()}</Text>
          </View>
          <View style={styles.infoSessione}>
            <Text style={styles.nomeScheda} numberOfLines={1}>{item.planName ?? 'Allenamento libero'}</Text>
            <Text style={styles.dataCompleta}>{data.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric' })}</Text>
          </View>
          <View style={styles.rigaAzioni}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/history/edit/[id]', params: { id: item.id } })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="pencil-outline" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleElimina(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rigaStatistiche}>
          <View style={styles.elementoStatistica}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.testoStatistica}>{item.duration} min</Text>
          </View>
          <View style={styles.elementoStatistica}>
            <Ionicons name="barbell-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.testoStatistica}>{item.exercisesDone.length} esercizi</Text>
          </View>
          <View style={[styles.etichettaAffaticamento, { backgroundColor: coloreRPE + '22' }]}>
            <Text style={[styles.testoAffaticamento, { color: coloreRPE }]}>RPE {item.fatigueLevel}/10</Text>
          </View>
        </View>
        {item.notes ? <Text style={styles.note} numberOfLines={2}>&quot;{item.notes}&quot;</Text> : null}
      </View>
    );
  };

  const minutiTotali = calculateTotalMinutes(history);
  const affaticamentoMedio = calculateAverageRPE(history);

  // ──────── Preparazione Dati Grafici ────────
  const datiDurata = formatDurationChartData(history, Colors.primary);
  const datiFatica = formatRPEChartData(history, Colors.accent);
  const datiGruppiMuscolari = formatMuscleVolumeChartData(history, exercises, Colors.accent);

  const renderAnalisiGrafica = () => {
    if (history.length === 0) return null;
    return (
      <FlatList
        data={[1]}
        keyExtractor={(item) => String(item)}
        renderItem={() => (
          <View style={styles.graficiContenitore}>
            {/* Grafico Durata Allenamenti */}
            <View style={styles.sezioneGrafico}>
              <Text style={styles.titoloGrafico}>Andamento Durata (minuti)</Text>
              {datiDurata.length > 0 ? (
                <BarChart
                  data={datiDurata}
                  barWidth={24}
                  spacing={18}
                  noOfSections={4}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor={Colors.border}
                  xAxisLabelTextStyle={{ fontSize: 9, color: Colors.textSecondary }}
                  yAxisTextStyle={{ fontSize: 9, color: Colors.textMuted }}
                  height={150}
                  width={screenWidth - 80}
                  isAnimated
                />
              ) : (
                <Text style={styles.testoVuotoGrafico}>Dati insufficienti</Text>
              )}
            </View>

            {/* Grafico Fatica Percepita RPE */}
            <View style={styles.sezioneGrafico}>
              <Text style={styles.titoloGrafico}>Trend Fatica Percepita (RPE)</Text>
              {datiFatica.length > 0 ? (
                <LineChart
                  data={datiFatica}
                  color={Colors.primary}
                  thickness={3}
                  noOfSections={5}
                  maxValue={10}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor={Colors.border}
                  dataPointsColor={Colors.primary}
                  xAxisLabelTextStyle={{ fontSize: 9, color: Colors.textSecondary }}
                  yAxisTextStyle={{ fontSize: 9, color: Colors.textMuted }}
                  height={150}
                  width={screenWidth - 80}
                  isAnimated
                />
              ) : (
                <Text style={styles.testoVuotoGrafico}>Dati insufficienti</Text>
              )}
            </View>

            {/* Grafico Distribuzione Lavoro Muscolare */}
            <View style={styles.sezioneGrafico}>
              <Text style={styles.titoloGrafico}>Volume per Gruppo Muscolare (Serie Totali)</Text>
              {datiGruppiMuscolari.length > 0 ? (
                <BarChart
                  data={datiGruppiMuscolari}
                  barWidth={20}
                  spacing={12}
                  noOfSections={4}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  xAxisColor={Colors.border}
                  xAxisLabelTextStyle={{ fontSize: 8, color: Colors.textSecondary }}
                  yAxisTextStyle={{ fontSize: 9, color: Colors.textMuted }}
                  height={150}
                  width={screenWidth - 80}
                  isAnimated
                />
              ) : (
                <Text style={styles.testoVuotoGrafico}>Nessun esercizio registrato</Text>
              )}
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.contenitore}>
      {/* Selettore Tab Lista vs Statistiche */}
      <View style={styles.selettoreTab}>
        <TouchableOpacity
          style={[styles.tab, visualizzazione === 'lista' && styles.tabAttiva]}
          onPress={() => setVisualizzazione('lista')}
        >
          <Text style={[styles.testoTab, visualizzazione === 'lista' && styles.testoTabAttivo]}>Elenco Allenamenti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, visualizzazione === 'grafici' && styles.tabAttiva]}
          onPress={() => setVisualizzazione('grafici')}
        >
          <Text style={[styles.testoTab, visualizzazione === 'grafici' && styles.testoTabAttivo]}>Statistiche & Analisi</Text>
        </TouchableOpacity>
      </View>

      {visualizzazione === 'lista' ? (
        <>
          {history.length > 0 && (
            <View style={styles.intestazioneStatistiche}>
              <View style={styles.cardStatistica}>
                <Text style={styles.valoreStatistica}>{history.length}</Text>
                <Text style={styles.etichettaStatistica}>Sessioni</Text>
              </View>
              <View style={styles.cardStatistica}>
                <Text style={styles.valoreStatistica}>{Math.round(minutiTotali / 60)}h</Text>
                <Text style={styles.etichettaStatistica}>Ore totali</Text>
              </View>
              <View style={styles.cardStatistica}>
                <Text style={styles.valoreStatistica}>{affaticamentoMedio}</Text>
                <Text style={styles.etichettaStatistica}>RPE medio</Text>
              </View>
            </View>
          )}
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderCardSessione}
            contentContainerStyle={styles.contenutoLista}
            ListEmptyComponent={
              <View style={styles.statoVuoto}>
                <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.testoStatoVuoto}>Nessun allenamento registrato</Text>
                <Text style={styles.sottotestoStatoVuoto}>Completa una sessione per vederla qui</Text>
              </View>
            }
          />
        </>
      ) : (
        renderAnalisiGrafica()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  selettoreTab: { flexDirection: 'row', backgroundColor: Colors.surface, padding: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: Radius.sm },
  tabAttiva: { backgroundColor: Colors.primaryLight + '15' },
  testoTab: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  testoTabAttivo: { color: Colors.primary },

  intestazioneStatistiche: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  cardStatistica: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  valoreStatistica: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.primary },
  etichettaStatistica: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  contenutoLista: { padding: Spacing.md, gap: 10, paddingBottom: 40 },
  scheda: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  intestazioneScheda: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  bloccoData: { width: 48, height: 48, backgroundColor: Colors.primaryLight + '22', borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '44' },
  giorno: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.primary },
  mese: { fontSize: 9, color: Colors.primary, fontWeight: '700' },
  infoSessione: { flex: 1 },
  nomeScheda: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  dataCompleta: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  rigaAzioni: { flexDirection: 'row', alignItems: 'center' },
  rigaStatistiche: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  elementoStatistica: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testoStatistica: { fontSize: FontSize.sm, color: Colors.textSecondary },
  etichettaAffaticamento: { marginLeft: 'auto', paddingVertical: 3, paddingHorizontal: 8, borderRadius: Radius.full },
  testoAffaticamento: { fontSize: FontSize.xs, fontWeight: '700' },
  note: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', marginTop: 6 },
  statoVuoto: { alignItems: 'center', marginTop: 80, gap: 12 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.sm },

  graficiContenitore: { padding: Spacing.md, gap: Spacing.lg, paddingBottom: 60 },
  sezioneGrafico: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  titoloGrafico: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.md },
  testoVuotoGrafico: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginVertical: 20 },
});