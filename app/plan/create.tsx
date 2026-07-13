// app/plan/create.tsx — Crea Nuova Scheda
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutPlanStore } from '../../store/workoutPlanStore';
import { useExerciseStore } from '../../store/exerciseStore';
import { WorkoutPlan, PlanExercise, Difficulty } from '../../models/types';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const DIFFICOLTA: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzato'];
const OBIETTIVI = ['Ipertrofia', 'Forza massimale', 'Resistenza', 'Dimagrimento', 'Condizionamento', 'Mobilità'];

export default function CreatePlanScreen() {
  const router = useRouter();
  const addPlan = useWorkoutPlanStore((s) => s.addPlan);
  const esercizi = useExerciseStore((s) => s.exercises);

  const [nome, setNome] = useState('');
  const [obiettivo, setObiettivo] = useState('Ipertrofia');
  const [livello, setLivello] = useState<Difficulty>('Intermedio');
  const [durata, setDurata] = useState('60');
  const [frequenza, setFrequenza] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [eserciziScheda, setEserciziScheda] = useState<PlanExercise[]>([]);
  const [mostraSelettore, setMostraSelettore] = useState(false);

  const aggiungiEsercizio = (esercizioId: string) => {
    const giaPresente = eserciziScheda.find((pe) => pe.exerciseId === esercizioId);
    if (giaPresente) { setMostraSelettore(false); return; }
    setEserciziScheda((prev) => [...prev, { exerciseId: esercizioId, sets: 3, reps: 10, restTime: 60, order: prev.length }]);
    setMostraSelettore(false);
  };

  const aggiornaParametro = (indice: number, campo: keyof PlanExercise, valore: number) => {
    setEserciziScheda((prev) => prev.map((pe, i) => i === indice ? { ...pe, [campo]: valore } : pe));
  };

  const rimuoviEsercizio = (indice: number) => {
    setEserciziScheda((prev) => prev.filter((_, i) => i !== indice).map((pe, i) => ({ ...pe, order: i })));
  };

  const handleSalva = async () => {
    if (!nome.trim()) { Alert.alert('Errore', 'Inserisci il nome della scheda.'); return; }
    
    const durataMin = parseInt(durata) || 0;
    if (durataMin <= 0) {
      Alert.alert('Errore', 'La durata prevista deve essere maggiore di zero.');
      return;
    }

    if (eserciziScheda.length === 0) { Alert.alert('Errore', 'Aggiungi almeno un esercizio.'); return; }

    for (const ex of eserciziScheda) {
      const nomeEx = nomeEsercizio(ex.exerciseId);
      if (ex.sets <= 0) {
        Alert.alert('Errore', `Il numero di serie per "${nomeEx}" deve essere maggiore di zero.`);
        return;
      }
      if (ex.reps <= 0) {
        Alert.alert('Errore', `Le ripetizioni per "${nomeEx}" devono essere maggiori di zero.`);
        return;
      }
      if (ex.restTime < 0) {
        Alert.alert('Errore', `Il tempo di recupero per "${nomeEx}" non può essere negativo.`);
        return;
      }
      if (ex.weight !== undefined && ex.weight < 0) {
        Alert.alert('Errore', `Il peso per "${nomeEx}" non può essere negativo.`);
        return;
      }
    }

    let freqStr: string | undefined = undefined;
    if (frequenza.trim()) {
      const freqVal = parseInt(frequenza);
      if (isNaN(freqVal) || freqVal <= 0) {
        Alert.alert('Errore', 'La frequenza deve essere un valore maggiore di zero.');
        return;
      }
      freqStr = `${freqVal}x/settimana`;
    }

    const piano: WorkoutPlan = {
      id: Date.now().toString(),
      name: nome.trim(),
      goal: obiettivo,
      level: livello,
      expectedDuration: durataMin,
      frequency: freqStr,
      description: descrizione.trim() || undefined,
      exercises: eserciziScheda,
    };
    await addPlan(piano);
    router.back();
  };

  const nomeEsercizio = (id: string) => esercizi.find((e) => e.id === id)?.name ?? id;

  return (
    <ScrollView style={styles.contenitore} contentContainerStyle={styles.contenuto}>
      <Stack.Screen options={{ title: 'Nuova Scheda', headerBackTitle: 'back' }} />

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Nome Scheda *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="es. Push A - Forza" placeholderTextColor={Colors.textMuted} />
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Obiettivo</Text>
        <View style={styles.grigliaChip}>
          {OBIETTIVI.map((o) => (
            <TouchableOpacity key={o} style={[styles.chip, obiettivo === o && styles.chipSelezionato]} onPress={() => setObiettivo(o)}>
              <Text style={[styles.testoChip, obiettivo === o && styles.testoChipSelezionato]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Livello</Text>
        <View style={styles.rigaOpzioni}>
          {DIFFICOLTA.map((d) => (
            <TouchableOpacity key={d} style={[styles.pulsanteOpzione, livello === d && styles.pulsanteOpzioneAttivo]} onPress={() => setLivello(d)}>
              <Text style={[styles.testoOpzione, livello === d && styles.testoOpzioneAttivo]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.rigaCampi}>
        <View style={[styles.gruppoCampo, { flex: 1 }]}>
          <Text style={styles.etichetta}>Durata (min)</Text>
          <TextInput style={styles.input} value={durata} onChangeText={setDurata} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />
        </View>
        <View style={[styles.gruppoCampo, { flex: 1 }]}>
          <Text style={styles.etichetta}>Frequenza (x/settimana)</Text>
          <TextInput style={styles.input} value={frequenza} onChangeText={setFrequenza} keyboardType="numeric" placeholder="es. 3" placeholderTextColor={Colors.textMuted} />
        </View>
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Descrizione</Text>
        <TextInput style={[styles.input, styles.areaTestuale]} value={descrizione} onChangeText={setDescrizione} multiline numberOfLines={3} placeholderTextColor={Colors.textMuted} placeholder="Descrivi la scheda..." />
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Esercizi ({eserciziScheda.length})</Text>
        {eserciziScheda.map((pe, indice) => (
          <View key={indice} style={styles.rigaEsercizio}>
            <View style={styles.intestazioneRigaEsercizio}>
              <Text style={styles.nomeEsercizioScheda} numberOfLines={1}>{nomeEsercizio(pe.exerciseId)}</Text>
              <TouchableOpacity onPress={() => rimuoviEsercizio(indice)}>
                <Ionicons name="close-circle" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
            <View style={styles.campiParametri}>
              <CampoNumerico etichetta="Serie" valore={pe.sets} onChange={(v) => aggiornaParametro(indice, 'sets', v)} />
              <CampoNumerico etichetta="Rip." valore={pe.reps} onChange={(v) => aggiornaParametro(indice, 'reps', v)} />
              <CampoNumerico etichetta="Rec. (s)" valore={pe.restTime} onChange={(v) => aggiornaParametro(indice, 'restTime', v)} />
              <CampoNumerico etichetta="Peso (kg)" valore={pe.weight ?? 0} onChange={(v) => aggiornaParametro(indice, 'weight', v)} />
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.pulsanteAggiungiEsercizio} onPress={() => setMostraSelettore(true)}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.testoPulsanteAggiungi}>Aggiungi esercizio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.pulsanteSalva} onPress={handleSalva}>
        <Text style={styles.testoPulsanteSalva}>Salva Scheda</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />

      <Modal visible={mostraSelettore} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.intestazioneModal}>
            <Text style={styles.titoloModal}>Seleziona Esercizio</Text>
            <TouchableOpacity onPress={() => setMostraSelettore(false)}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={esercizi}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const giaAggiunto = eserciziScheda.some((pe) => pe.exerciseId === item.id);
              return (
                <TouchableOpacity
                  style={[styles.rigaSelettore, giaAggiunto && styles.rigaSelettoreDisabilitata]}
                  onPress={() => !giaAggiunto && aggiungiEsercizio(item.id)}
                  disabled={giaAggiunto}
                >
                  <View>
                    <Text style={[styles.nomeEsercizioSelettore, giaAggiunto && { color: Colors.textMuted }]}>{item.name}</Text>
                    <Text style={styles.muscoloEsercizioSelettore}>{item.primaryMuscle}</Text>
                  </View>
                  {giaAggiunto && <Text style={styles.etichettaGiaAggiunto}>Aggiunto</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

function CampoNumerico({ etichetta, valore, onChange }: { etichetta: string; valore: number; onChange: (v: number) => void }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 3 }}>{etichetta}</Text>
      <TextInput
        style={styles.inputNumerico}
        value={String(valore)}
        onChangeText={(t) => onChange(parseInt(t) || 0)}
        keyboardType="numeric"
        selectTextOnFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenuto: { padding: Spacing.md },
  gruppoCampo: { marginBottom: Spacing.md },
  rigaCampi: { flexDirection: 'row', gap: Spacing.md },
  etichetta: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  areaTestuale: { height: 80, textAlignVertical: 'top' },
  grigliaChip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, backgroundColor: Colors.surface },
  chipSelezionato: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoChip: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  testoChipSelezionato: { color: '#fff' },
  rigaOpzioni: { flexDirection: 'row', gap: 8 },
  pulsanteOpzione: { flex: 1, padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, alignItems: 'center', backgroundColor: Colors.surface },
  pulsanteOpzioneAttivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoOpzione: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  testoOpzioneAttivo: { color: '#fff' },
  rigaEsercizio: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  intestazioneRigaEsercizio: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  nomeEsercizioScheda: { fontSize: FontSize.md, fontWeight: 'bold', color: Colors.textPrimary, flex: 1 },
  campiParametri: { flexDirection: 'row', gap: 4 },
  inputNumerico: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm, padding: 8, fontSize: FontSize.md, color: Colors.textPrimary, width: 60, textAlign: 'center', borderWidth: 1, borderColor: Colors.border },
  pulsanteAggiungiEsercizio: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed' },
  testoPulsanteAggiungi: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.md },
  pulsanteSalva: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginTop: Spacing.sm, ...Shadow.md },
  testoPulsanteSalva: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
  modal: { flex: 1, backgroundColor: Colors.background },
  intestazioneModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  titoloModal: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary },
  rigaSelettore: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rigaSelettoreDisabilitata: { opacity: 0.5 },
  nomeEsercizioSelettore: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  muscoloEsercizioSelettore: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  etichettaGiaAggiunto: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic' },
});
