import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useExerciseStore } from '../../store/exerciseStore';
import { Exercise, Difficulty } from '../../models/types';

export default function CreateExerciseScreen() {
  const router = useRouter();
  const addExercise = useExerciseStore((state) => state.addExercise);

  // Stati per memorizzare i valori digitati dall'utente
  const [name, setName] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Principiante');

  const handleSave = () => {
    // Validazione base
    if (!name.trim() || !primaryMuscle.trim() || !equipment.trim()) {
      Alert.alert('Errore', 'Compila almeno Nome, Gruppo Muscolare e Attrezzo.');
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
      primaryMuscle,
      equipment,
      description,
      difficulty,
      secondaryMuscles: [],
    };

    // Salviamo e torniamo indietro
    addExercise(newExercise);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Nuovo Esercizio',
          headerBackTitle: 'false' 
        }} 
      />

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome Esercizio *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="es. Panca piana" 
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Gruppo Muscolare *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="es. Pettorali" 
          value={primaryMuscle}
          onChangeText={setPrimaryMuscle}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Attrezzatura *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="es. Bilanciere" 
          value={equipment}
          onChangeText={setEquipment}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Difficoltà</Text>
        <View style={styles.difficultyContainer}>
          {['Principiante', 'Intermedio', 'Avanzato'].map((level) => (
            <TouchableOpacity 
              key={level}
              style={[
                styles.difficultyBtn, 
                difficulty === level && styles.difficultyBtnActive
              ]}
              onPress={() => setDifficulty(level as Difficulty)}
            >
              <Text style={[
                styles.difficultyText,
                difficulty === level && styles.difficultyTextActive
              ]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descrizione o Note</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Inserisci istruzioni..." 
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Salva Esercizio</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  difficultyContainer: { flexDirection: 'row', gap: 8 },
  difficultyBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  difficultyBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyText: { color: '#666', fontWeight: '500' },
  difficultyTextActive: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});