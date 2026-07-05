// app/exercise/create.tsx — Crea Nuovo Esercizio
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useExerciseStore } from '../../store/exerciseStore';
import { Exercise, Difficulty } from '../../models/types';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';

const LIVELLI_DIFFICOLTA: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzato'];
const OPZIONI_ATTREZZATURA = [
  'Corpo libero', 'Bilanciere', 'Manubri', 'Kettlebell',
  'Cavi', 'Macchinario', 'Sbarra', 'Elastici', 'Altro',
];

export default function CreateExerciseScreen() {
  const router = useRouter();
  const addExercise = useExerciseStore((s) => s.addExercise);

  const [nome, setNome] = useState('');
  const [muscoloPrincipale, setMuscoloPrincipale] = useState('');
  const [muscoliSecondari, setMuscoliSecondari] = useState('');
  const [attrezzatura, setAttrezzatura] = useState('Corpo libero');
  const [descrizione, setDescrizione] = useState('');
  const [difficolta, setDifficolta] = useState<Difficulty>('Principiante');
  const [note, setNote] = useState('');

  const handleSalva = async () => {
    if (!nome.trim() || !muscoloPrincipale.trim()) {
      Alert.alert('Errore', 'Nome e Gruppo Muscolare sono obbligatori.');
      return;
    }
    const nuovoEsercizio: Exercise = {
      id: Date.now().toString(),
      name: nome.trim(),
      primaryMuscle: muscoloPrincipale.trim(),
      secondaryMuscles: muscoliSecondari.split(',').map((s) => s.trim()).filter(Boolean),
      equipment: attrezzatura,
      description: descrizione.trim(),
      difficulty: difficolta,
      notes: note.trim() || undefined,
    };
    await addExercise(nuovoEsercizio);
    router.back();
  };

  return (
    <ScrollView style={styles.contenitore} contentContainerStyle={styles.contenuto}>
      <Stack.Screen options={{ title: 'Nuovo Esercizio', headerBackTitle: 'back' }} />

      <CampoTesto etichetta="Nome Esercizio *" valore={nome} onChange={setNome} placeholder="es. Panca Piana" />
      <CampoTesto etichetta="Gruppo Muscolare Principale *" valore={muscoloPrincipale} onChange={setMuscoloPrincipale} placeholder="es. Pettorali" />
      <CampoTesto etichetta="Muscoli Secondari" valore={muscoliSecondari} onChange={setMuscoliSecondari} placeholder="es. Tricipiti, Spalle (separati da virgola)" />

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Difficoltà</Text>
        <View style={styles.rigaOpzioni}>
          {LIVELLI_DIFFICOLTA.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.pulsanteOpzione, difficolta === d && styles.pulsanteOpzioneAttivo]}
              onPress={() => setDifficolta(d)}
            >
              <Text style={[styles.testoPulsanteOpzione, difficolta === d && styles.testoPulsanteOpzioneAttivo]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.gruppoCampo}>
        <Text style={styles.etichetta}>Attrezzatura</Text>
        <View style={styles.grigliaAttrezzatura}>
          {OPZIONI_ATTREZZATURA.map((eq) => (
            <TouchableOpacity
              key={eq}
              style={[styles.chipAttrezzatura, attrezzatura === eq && styles.chipAttrezzaturaSelezionato]}
              onPress={() => setAttrezzatura(eq)}
            >
              <Text style={[styles.testoChipAttrezzatura, attrezzatura === eq && styles.testoChipAttrezzaturaSelezionato]}>{eq}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <CampoTesto etichetta="Descrizione" valore={descrizione} onChange={setDescrizione} placeholder="Istruzioni tecniche..." multilinea />
      <CampoTesto etichetta="Note" valore={note} onChange={setNote} placeholder="Consigli extra..." multilinea />

      <TouchableOpacity style={styles.pulsanteSalva} onPress={handleSalva}>
        <Text style={styles.testoPulsanteSalva}>Salva Esercizio</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function CampoTesto({ etichetta, valore, onChange, placeholder, multilinea }: {
  etichetta: string; valore: string; onChange: (t: string) => void; placeholder?: string; multilinea?: boolean;
}) {
  return (
    <View style={styles.gruppoCampo}>
      <Text style={styles.etichetta}>{etichetta}</Text>
      <TextInput
        style={[styles.input, multilinea && styles.areaTestuale]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={valore}
        onChangeText={onChange}
        multiline={multilinea}
        numberOfLines={multilinea ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { flex: 1, backgroundColor: Colors.background },
  contenuto: { padding: Spacing.md },
  gruppoCampo: { marginBottom: Spacing.md },
  etichetta: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  areaTestuale: { height: 90, textAlignVertical: 'top' },
  rigaOpzioni: { flexDirection: 'row', gap: 8 },
  pulsanteOpzione: { flex: 1, padding: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, alignItems: 'center', backgroundColor: Colors.surface },
  pulsanteOpzioneAttivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoPulsanteOpzione: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  testoPulsanteOpzioneAttivo: { color: '#fff' },
  grigliaAttrezzatura: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipAttrezzatura: { paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, backgroundColor: Colors.surface },
  chipAttrezzaturaSelezionato: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  testoChipAttrezzatura: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  testoChipAttrezzaturaSelezionato: { color: '#fff' },
  pulsanteSalva: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center', marginTop: Spacing.md },
  testoPulsanteSalva: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
});