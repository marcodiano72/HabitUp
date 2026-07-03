// app/(tabs)/history.tsx — Storico Allenamenti
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';
import { WorkoutSession } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const coloreAffaticamento = (livello: number) => {
  if (livello <= 3) return Colors.success;
  if (livello <= 6) return Colors.warning;
  return Colors.danger;
};

export default function HistoryScreen() {
  const history = useHistoryStore((s) => s.history);
  const deleteSession = useHistoryStore((s) => s.deleteSession);

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
          <TouchableOpacity onPress={() => handleElimina(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
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

  const minutiTotali = history.reduce((acc, s) => acc + s.duration, 0);
  const affaticamentoMedio = history.length > 0
    ? (history.reduce((acc, s) => acc + s.fatigueLevel, 0) / history.length).toFixed(1)
    : '—';

  return (
    <View style={styles.contenitore}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
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
  rigaStatistiche: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  elementoStatistica: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  testoStatistica: { fontSize: FontSize.sm, color: Colors.textSecondary },
  etichettaAffaticamento: { marginLeft: 'auto', paddingVertical: 3, paddingHorizontal: 8, borderRadius: Radius.full },
  testoAffaticamento: { fontSize: FontSize.xs, fontWeight: '700' },
  note: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic', marginTop: 6 },
  statoVuoto: { alignItems: 'center', marginTop: 80, gap: 12 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.sm },
});