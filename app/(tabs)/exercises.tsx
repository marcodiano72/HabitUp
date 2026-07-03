import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Importiamo il nostro store e il tipo
import { useExerciseStore } from '../../store/exerciseStore';
import { Exercise } from '../../models/types';
import { Ionicons } from '@expo/vector-icons';

export default function ExercisesScreen() {
  const router = useRouter();
  
  // ---> RECUPERIAMO I DATI DALLO STORE:
  // Invece di leggere MOCK_EXERCISES dal file statico, leggiamo lo stato globale.
  // Quando aggiungeremo o elimineremo un esercizio, questa lista si aggiornerà automaticamente!
  const exercises = useExerciseStore((state) => state.exercises);
  
  // Questa funzione descrive come deve essere disegnata la singola "card" dell'esercizio
  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.id } })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      
      <View style={styles.badgesContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.primaryMuscle}</Text>
        </View>
        <View style={[styles.badge, styles.difficultyBadge]}>
          <Text style={styles.badgeText}>{item.difficulty}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

 return (
  <View style={styles.container}>
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id} 
      renderItem={renderExerciseCard} 
      contentContainerStyle={styles.listContent}
    />

    {/* NUOVO PULSANTE AGGIUNGI */}
    <TouchableOpacity 
      style={styles.fab} 
      onPress={() => router.push('/exercise/create')}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  </View>
);
}

// Un po' di stile per rendere tutto carino
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 8 
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#e3f2fd', 
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  difficultyBadge: {
    backgroundColor: '#e8f5e9', 
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  fab: {
  position: 'absolute',
  right: 20,
  bottom: 20,
  backgroundColor: '#007AFF', // Colore blu (puoi mettere il verde del logo!)
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 6,
}
});