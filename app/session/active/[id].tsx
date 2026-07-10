// app/session/active/[id].tsx — Schermata Allenamento Attivo con Timer
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../../../constants/theme';
import { useTimer } from '../../../hooks/useTimer';
import { SessionExercise, WorkoutSession } from '../../../models/types';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useHistoryStore } from '../../../store/historyStore';
import { useSessionStore } from '../../../store/sessionStore';
import { useWorkoutPlanStore } from '../../../store/workoutPlanStore';

export default function ActiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const sessions = useSessionStore((s) => s.sessions);
  const markCompleted = useSessionStore((s) => s.markCompleted);
  const plans = useWorkoutPlanStore((s) => s.plans);
  const exercises = useExerciseStore((s) => s.exercises);
  const addHistory = useHistoryStore((s) => s.addSession);

  const sessione = sessions.find((s) => s.id === id);
  const piano = sessione ? plans.find((p) => p.id === sessione.planId) : null;

  const [indiceEsercizioCorrente, setIndiceEsercizioCorrente] = useState(0);
  const [serieCorrente, setSerieCorrente] = useState(1);
  const [registrazioni, setRegistrazioni] = useState<SessionExercise[]>([]);
  const [pesoInserito, setPesoInserito] = useState('');
  const [ripetizioni, setRipetizioni] = useState('');
  const [livelloFatica, setLivelloFatica] = useState(5);
  const [oraInizio] = useState(new Date());
  const [fase, setFase] = useState<'allenamento' | 'recupero' | 'completato'>('allenamento');

  const timer = useTimer();
  const animazioneTimer = useRef(new Animated.Value(0)).current;

  // Feedback aptico all'avvio della scheda di allenamento (successo)
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  useEffect(() => {
    if (fase === 'recupero' && timer.status === 'running') {
      Animated.timing(animazioneTimer, {
        toValue: 1,
        duration: timer.timeLeft * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (timer.status === 'finished') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setFase('allenamento');
      const esercizioCorrente = piano?.exercises[indiceEsercizioCorrente];
      setSerieCorrente((s) => {
        const maxSerie = esercizioCorrente?.sets ?? 1;
        return s >= maxSerie ? 1 : s + 1;
      });
    }
  }, [fase, timer.status, animazioneTimer, timer.timeLeft, indiceEsercizioCorrente, piano?.exercises]);

  if (!sessione || !piano) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen options={{ title: 'Errore', headerBackTitle: 'back' }} />
        <Text style={{ color: Colors.danger }}>Sessione non trovata</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>← Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const eserciziOrdinati = [...piano.exercises].sort((a, b) => a.order - b.order);
  const esercizioSchedaCorrente = eserciziOrdinati[indiceEsercizioCorrente];
  const esercizioCorrente = exercises.find((e) => e.id === esercizioSchedaCorrente?.exerciseId);
  const totaleEsercizi = eserciziOrdinati.length;
  const progressoGlobale = (indiceEsercizioCorrente + (serieCorrente - 1) / (esercizioSchedaCorrente?.sets ?? 1)) / totaleEsercizi;

  const handleSerieCompletata = () => {
    const peso = parseFloat(pesoInserito) || 0;
    const rip = parseInt(ripetizioni) || esercizioSchedaCorrente.reps;

    // Vibrazione media al completamento di ogni serie
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setRegistrazioni((prev) => {
      const esistente = prev.find((l) => l.exerciseId === esercizioSchedaCorrente.exerciseId);
      if (esistente) {
        return prev.map((l) =>
          l.exerciseId === esercizioSchedaCorrente.exerciseId
            ? { ...l, sets: l.sets + 1, reps: rip, weight: peso }
            : l
        );
      }
      return [...prev, { exerciseId: esercizioSchedaCorrente.exerciseId, sets: 1, reps: rip, weight: peso }];
    });

    if (serieCorrente < esercizioSchedaCorrente.sets) {
      setFase('recupero');
      animazioneTimer.setValue(0);
      timer.start(esercizioSchedaCorrente.restTime);
      setSerieCorrente((s) => s + 1);
    } else {
      if (indiceEsercizioCorrente + 1 < totaleEsercizi) {
        setIndiceEsercizioCorrente((i) => i + 1);
        setSerieCorrente(1);
        setPesoInserito('');
        setRipetizioni('');
        setFase('recupero');
        timer.start(60);
      } else {
        setFase('completato');
      }
    }
  };

  const handleConcludi = async () => {
    const durata = Math.round((new Date().getTime() - oraInizio.getTime()) / 60000);
    const sessioneCompletata: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      planId: piano.id,
      planName: piano.name,
      duration: durata || 1,
      exercisesDone: registrazioni,
      fatigueLevel: livelloFatica,
    };
    await addHistory(sessioneCompletata);
    await markCompleted(sessione.id);
    Alert.alert(
      '🎉 Allenamento completato!',
      `Durata: ${durata} min\nFatica: ${livelloFatica}/10`,
      [{ text: 'Ok', onPress: () => router.replace('/(tabs)') }]
    );
  };

  const handleSaltaRecupero = () => {
    timer.reset();
    setFase('allenamento');
  };

  // ─── SCHERMATA COMPLETAMENTO ───
  if (fase === 'completato') {
    const durata = Math.round((new Date().getTime() - oraInizio.getTime()) / 60000);
    return (
      <View style={styles.schermataConclusione}>
        <Stack.Screen options={{ title: 'Completato!', headerLeft: () => null, headerBackTitle: 'back' }} />
        <Ionicons name="trophy" size={80} color={Colors.warning} />
        <Text style={styles.titoloConcluso}>Allenamento completato!</Text>
        <Text style={styles.riepilogoConcluso}>Durata: {durata} min · {registrazioni.length} esercizi</Text>

        <Text style={styles.etichettaFatica}>Com&apos;è andata? (RPE 1–10)</Text>
        <View style={styles.selettoreFatica}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.numeroFatica, livelloFatica === n && styles.numeriFaticaSelezionato]}
              onPress={() => setLivelloFatica(n)}
            >
              <Text style={[styles.testoNumeroFatica, livelloFatica === n && { color: '#fff' }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.pulsanteConcludi} onPress={handleConcludi}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.testoPulsanteConcludi}>Salva e Concludi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.contenitore}>
      <Stack.Screen options={{ title: piano.name, headerBackTitle: 'back' }} />

      {/* Barra di progresso globale */}
      <View style={styles.barraProgressoGlobale}>
        <View style={[styles.riempimentoProgressoGlobale, { width: `${progressoGlobale * 100}%` }]} />
      </View>
      <Text style={styles.testoProgresso}>Esercizio {indiceEsercizioCorrente + 1}/{totaleEsercizi}</Text>

      {/* ─── FASE RECUPERO ─── */}
      {fase === 'recupero' ? (
        <View style={styles.schermataRecupero}>
          <Text style={styles.titoloRecupero}>Recupero</Text>
          <Text style={styles.contatoreTimer}>{timer.formatTime(timer.timeLeft)}</Text>

          <View style={styles.barraTimer}>
            <View style={[styles.riempimentoTimer, { width: `${(1 - timer.progress) * 100}%` }]} />
          </View>

          <Text style={styles.etichettaProssimoEsercizio}>Prossimo esercizio</Text>
          <Text style={styles.nomeProssimoEsercizio}>{esercizioCorrente?.name ?? '—'}</Text>

          <TouchableOpacity style={styles.pulsanteSaltaRecupero} onPress={handleSaltaRecupero}>
            <Text style={styles.testoPulsanteSaltaRecupero}>Salta recupero →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── FASE ALLENAMENTO ─── */
        <ScrollView contentContainerStyle={styles.contenutoAllenamento}>
          {/* Card esercizio corrente */}
          <View style={styles.cardEsercizioAttivo}>
            <Text style={styles.nomeEsercizioAttivo}>{esercizioCorrente?.name ?? 'Esercizio'}</Text>
            <Text style={styles.muscoloEsercizioAttivo}>{esercizioCorrente?.primaryMuscle}</Text>
            <View style={styles.indicatoreSerie}>
              {Array.from({ length: esercizioSchedaCorrente.sets }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.puntino,
                    i < serieCorrente - 1 && styles.puntinoCOmpletato,
                    i === serieCorrente - 1 && styles.puntinoCorrente,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.etichettaSerie}>Serie {serieCorrente} di {esercizioSchedaCorrente.sets}</Text>
          </View>

          {/* Obiettivi serie */}
          <View style={styles.cardObiettiviSerie}>
            <View style={styles.elementoObiettivo}>
              <Text style={styles.valoreObiettivo}>{esercizioSchedaCorrente.reps}</Text>
              <Text style={styles.etichettaObiettivo}>Rip. obiettivo</Text>
            </View>
            <View style={styles.separatoreObiettivo} />
            <View style={styles.elementoObiettivo}>
              <Text style={styles.valoreObiettivo}>{esercizioSchedaCorrente.restTime}s</Text>
              <Text style={styles.etichettaObiettivo}>Recupero</Text>
            </View>
            {esercizioSchedaCorrente.weight ? (
              <>
                <View style={styles.separatoreObiettivo} />
                <View style={styles.elementoObiettivo}>
                  <Text style={styles.valoreObiettivo}>{esercizioSchedaCorrente.weight}kg</Text>
                  <Text style={styles.etichettaObiettivo}>Suggerito</Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Registrazione serie */}
          <View style={styles.cardRegistrazione}>
            <Text style={styles.titoloRegistrazione}>Registra questa serie</Text>
            <View style={styles.rigaRegistrazione}>
              <View style={styles.campoRegistrazione}>
                <Text style={styles.etichettaCampoRegistrazione}>Ripetizioni effettive</Text>
                <TextInput
                  style={styles.inputRegistrazione}
                  value={ripetizioni}
                  onChangeText={setRipetizioni}
                  keyboardType="numeric"
                  placeholder={String(esercizioSchedaCorrente.reps)}
                  placeholderTextColor={Colors.textMuted}
                  selectTextOnFocus
                />
              </View>
              <View style={styles.campoRegistrazione}>
                <Text style={styles.etichettaCampoRegistrazione}>Peso utilizzato (kg)</Text>
                <TextInput
                  style={styles.inputRegistrazione}
                  value={pesoInserito}
                  onChangeText={setPesoInserito}
                  keyboardType="decimal-pad"
                  placeholder={esercizioSchedaCorrente.weight ? String(esercizioSchedaCorrente.weight) : '0'}
                  placeholderTextColor={Colors.textMuted}
                  selectTextOnFocus
                />
              </View>
            </View>
          </View>

          {/* Pulsante conferma serie */}
          <TouchableOpacity style={styles.pulsanteConfermasSerie} onPress={handleSerieCompletata}>
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.testoPulsanteConfermaSerie}>
              {serieCorrente < esercizioSchedaCorrente.sets ? 'Serie completata' : 'Esercizio completato'}
            </Text>
          </TouchableOpacity>

          {/* Riepilogo esercizi svolti */}
          {registrazioni.length > 0 && (
            <View style={styles.sezioneRiepilogo}>
              <Text style={styles.titoloRiepilogo}>Esercizi completati</Text>
              {registrazioni.map((log, i) => {
                const ex = exercises.find((e) => e.id === log.exerciseId);
                return (
                  <View key={i} style={styles.rigaEserciziCompletato}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.testoEsercizioCompletato}>
                      {ex?.name} — {log.sets}×{log.reps} @ {log.weight}kg
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.pulsanteTerminaAnticipato} onPress={() => setFase('completato')}>
            <Text style={styles.testoPulsanteTerminaAnticipato}>Termina allenamento anticipato</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  barraProgressoGlobale: { height: 3, backgroundColor: Colors.border },
  riempimentoProgressoGlobale: { height: '100%', backgroundColor: Colors.primary },
  testoProgresso: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.sm, paddingVertical: 6 },

  // Schermata recupero
  schermataRecupero: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  titoloRecupero: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  contatoreTimer: { fontSize: 72, fontWeight: '900', color: Colors.primary, fontVariant: ['tabular-nums'] },
  barraTimer: { width: '80%', height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden', marginVertical: 20 },
  riempimentoTimer: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  etichettaProssimoEsercizio: { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  nomeProssimoEsercizio: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 4, marginBottom: 24 },
  pulsanteSaltaRecupero: { backgroundColor: Colors.surface, borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: Colors.border },
  testoPulsanteSaltaRecupero: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.md },

  // Schermata allenamento
  contenutoAllenamento: { padding: Spacing.md },
  cardEsercizioAttivo: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, ...Shadow.md },
  nomeEsercizioAttivo: { fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  muscoloEsercizioAttivo: { fontSize: FontSize.md, color: Colors.primary, marginBottom: 16 },
  indicatoreSerie: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  puntino: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border },
  puntinoCOmpletato: { backgroundColor: Colors.success },
  puntinoCorrente: { backgroundColor: Colors.primary, transform: [{ scale: 1.3 }] },
  etichettaSerie: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '600' },

  cardObiettiviSerie: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  elementoObiettivo: { flex: 1, alignItems: 'center' },
  valoreObiettivo: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary },
  etichettaObiettivo: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  separatoreObiettivo: { width: 1, backgroundColor: Colors.border },

  cardRegistrazione: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  titoloRegistrazione: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  rigaRegistrazione: { flexDirection: 'row', gap: Spacing.md },
  campoRegistrazione: { flex: 1 },
  etichettaCampoRegistrazione: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 6 },
  inputRegistrazione: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, padding: 12, fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', borderWidth: 1, borderColor: Colors.border },

  pulsanteConfermasSerie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.md, marginBottom: Spacing.md },
  testoPulsanteConfermaSerie: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },

  sezioneRiepilogo: { marginBottom: Spacing.md },
  titoloRiepilogo: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  rigaEserciziCompletato: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  testoEsercizioCompletato: { fontSize: FontSize.sm, color: Colors.textSecondary },

  pulsanteTerminaAnticipato: { alignItems: 'center', padding: Spacing.md },
  testoPulsanteTerminaAnticipato: { color: Colors.textMuted, fontSize: FontSize.sm },

  // Schermata conclusione
  schermataConclusione: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  titoloConcluso: { fontSize: FontSize.xxxl, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 20, marginBottom: 8, textAlign: 'center' },
  riepilogoConcluso: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 32 },
  etichettaFatica: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 12 },
  selettoreFatica: { flexDirection: 'row', gap: 6, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' },
  numeroFatica: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  numeriFaticaSelezionato: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoNumeroFatica: { color: Colors.textSecondary, fontWeight: '700' },
  pulsanteConcludi: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: 16, paddingHorizontal: 32, ...Shadow.lg },
  testoPulsanteConcludi: { color: '#fff', fontSize: FontSize.xl, fontWeight: 'bold' },
});
