import { View, Text, StyleSheet } from 'react-native';

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schede di Allenamento</Text>
      <Text>Qui potrai creare e visualizzare le tue routine.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 }
});