import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useExerciseStore } from '../../store/exerciseStore';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Ci serve per tornare indietro dopo l'eliminazione
  
  // Recuperiamo sia gli esercizi che la funzione per eliminare dallo store
  const exercises = useExerciseStore((state) => state.exercises);
  const deleteExercise = useExerciseStore((state) => state.deleteExercise);
  
  const exercise = exercises.find(e => e.id === id);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Errore', headerBackTitle: 'false' }} />
        <Text style={styles.errorText}>Esercizio non trovato!</Text>
      </View>
    );
  }

  // Funzione che gestisce il click sul tasto elimina
  const handleDelete = () => {
    Alert.alert(
      "Elimina Esercizio",
      "Sei sicuro di voler eliminare questo esercizio? L'azione è irreversibile.",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Elimina", 
          style: "destructive", // Su iOS lo renderà rosso
          onPress: () => {
            deleteExercise(exercise.id); // Eliminiamo dallo store
            router.back(); // Torniamo automaticamente alla lista
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: exercise.name,
          headerBackTitle: 'false' 
        }} 
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informazioni Base</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gruppo Principale:</Text>
          <Text style={styles.value}>{exercise.primaryMuscle}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Difficoltà:</Text>
          <Text style={styles.value}>{exercise.difficulty}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Attrezzatura:</Text>
          <Text style={styles.value}>{exercise.equipment}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Descrizione</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>

      {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Muscoli Secondari</Text>
          <Text style={styles.description}>{exercise.secondaryMuscles.join(', ')}</Text>
        </View>
      )}

      {/* PULSANTE ELIMINA */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Elimina Esercizio</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#666', fontWeight: '500' },
  value: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  description: { fontSize: 16, color: '#444', lineHeight: 24 },
  
  // Stili per il nuovo bottone Elimina
  deleteBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30', // Rosso
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteBtnText: { 
    color: '#ff3b30', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});