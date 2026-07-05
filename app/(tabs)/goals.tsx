// app/(tabs)/goals.tsx — Obiettivi Fisici con Filtri di Stato
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoalStore } from '../../store/goalStore';
import { Goal } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const CONFIGURAZIONE_STATO = {
  Attivo: { colore: Colors.primary, icona: 'rocket-outline' as const, etichetta: 'Attivo' },
  Completato: { colore: Colors.success, icona: 'checkmark-circle' as const, etichetta: 'Completato' },
  Abbandonato: { colore: Colors.textMuted, icona: 'close-circle-outline' as const, etichetta: 'Abbandonato' },
};

const STATI_FILTRI = ['Tutti', 'Attivo', 'Completato', 'Abbandonato'];

export default function GoalsScreen() {
  const router = useRouter();
  const goals = useGoalStore((s) => s.goals);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);

  const [filtroStato, setFiltroStato] = useState('Tutti');

  const obiettiviFiltrati = useMemo(() => {
    return goals.filter((g) => filtroStato === 'Tutti' || g.status === filtroStato);
  }, [goals, filtroStato]);

  const handlePressLungo = (obiettivo: Goal) => {
    Alert.alert(obiettivo.title, 'Cosa vuoi fare?', [
      { text: '✏️ Modifica', onPress: () => router.push({ pathname: '/goal/edit/[id]', params: { id: obiettivo.id } }) },
      {
        text: '🗑️ Elimina', style: 'destructive',
        onPress: () => Alert.alert('Elimina', `Eliminare "${obiettivo.title}"?`, [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Elimina', style: 'destructive', onPress: () => deleteGoal(obiettivo.id) },
        ]),
      },
      { text: 'Annulla', style: 'cancel' },
    ]);
  };

  const renderCardObiettivo = ({ item }: { item: Goal }) => {
    const progresso = Math.min(item.currentValue / item.targetValue, 1);
    const percentuale = Math.round(progresso * 100);
    const config = CONFIGURAZIONE_STATO[item.status];

    return (
      <TouchableOpacity
        style={styles.scheda}
        activeOpacity={0.75}
        onPress={() => router.push({ pathname: '/goal/edit/[id]', params: { id: item.id } })}
        onLongPress={() => handlePressLungo(item)}
      >
        <View style={styles.intestazioneScheda}>
          <View style={[styles.iconaStato, { backgroundColor: config.colore + '22' }]}>
            <Ionicons name={config.icona} size={20} color={config.colore} />
          </View>
          <View style={styles.infoObiettivo}>
            <Text style={styles.titolo} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.categoria}>{item.category}</Text>
          </View>
          <Text style={[styles.percentuale, { color: config.colore }]}>{percentuale}%</Text>
        </View>

        {item.description ? <Text style={styles.descrizione} numberOfLines={2}>{item.description}</Text> : null}

        <View style={styles.contenitoreProgresso}>
          <View style={styles.binarioPrgoresso}>
            <View style={[styles.riempimentoProgresso, {
              width: `${percentuale}%` as any,
              backgroundColor: item.status === 'Completato' ? Colors.success : config.colore,
            }]} />
          </View>
          <Text style={styles.valoriProgresso}>{item.currentValue} / {item.targetValue}</Text>
        </View>

        {item.endDate && (
          <View style={styles.rigaScadenza}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.testoScadenza}>Scadenza: {new Date(item.endDate).toLocaleDateString('it-IT')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const obiettiviAttivi = goals.filter((g) => g.status === 'Attivo').length;
  const obiettiviCompletati = goals.filter((g) => g.status === 'Completato').length;

  return (
    <View style={styles.contenitore}>
      {/* Sezione Filtri in alto */}
      <View style={styles.sezioneFiltri}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltriRow}>
          {STATI_FILTRI.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chipFiltro, filtroStato === item && styles.chipFiltroAttivo]}
              onPress={() => setFiltroStato(item)}
            >
              <Text style={[styles.testoChipFiltro, filtroStato === item && styles.testoChipFiltroAttivo]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {goals.length > 0 && (
        <View style={styles.rigaRiepilogo}>
          <View style={styles.chipRiepilogo}>
            <Ionicons name="rocket-outline" size={14} color={Colors.primary} />
            <Text style={styles.testoRiepilogo}>{obiettiviAttivi} attivi</Text>
          </View>
          <View style={styles.chipRiepilogo}>
            <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
            <Text style={styles.testoRiepilogo}>{obiettiviCompletati} completati</Text>
          </View>
        </View>
      )}

      <FlatList
        data={obiettiviFiltrati}
        keyExtractor={(item) => item.id}
        renderItem={renderCardObiettivo}
        contentContainerStyle={styles.contenutoLista}
        ListEmptyComponent={
          <View style={styles.statoVuoto}>
            <Ionicons name="trophy-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.testoStatoVuoto}>Nessun obiettivo trovato</Text>
            <Text style={styles.sottotestoStatoVuoto}>Prova a modificare il filtro o inseriscine uno nuovo</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.pulsanteFlottante} onPress={() => router.push('/goal/create')} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  sezioneFiltri: { backgroundColor: Colors.surface, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  scrollFiltriRow: { gap: 8, paddingHorizontal: Spacing.md },
  chipFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 14,
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
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  testoChipFiltroAttivo: { color: '#fff' },

  rigaRiepilogo: { flexDirection: 'row', padding: Spacing.md, paddingBottom: 0, gap: 8 },
  chipRiepilogo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, borderRadius: Radius.full, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  testoRiepilogo: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  contenutoLista: { padding: Spacing.md, gap: 12, paddingBottom: 100 },
  scheda: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  intestazioneScheda: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  iconaStato: { width: 40, height: 40, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  infoObiettivo: { flex: 1 },
  titolo: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary },
  categoria: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  percentuale: { fontSize: FontSize.xl, fontWeight: 'bold' },
  descrizione: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  contenitoreProgresso: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  binarioPrgoresso: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  riempimentoProgresso: { height: '100%', borderRadius: Radius.full },
  valoriProgresso: { fontSize: FontSize.xs, color: Colors.textMuted, width: 60, textAlign: 'right' },
  rigaScadenza: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  testoScadenza: { fontSize: FontSize.xs, color: Colors.textMuted },
  statoVuoto: { alignItems: 'center', marginTop: 80, gap: 12 },
  testoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.md, fontWeight: '600' },
  sottotestoStatoVuoto: { color: Colors.textMuted, fontSize: FontSize.sm },
  pulsanteFlottante: { position: 'absolute', right: 20, bottom: 24, backgroundColor: Colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', ...Shadow.lg },
});
