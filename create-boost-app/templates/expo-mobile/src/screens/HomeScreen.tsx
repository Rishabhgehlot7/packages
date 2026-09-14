import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const storeName = '{{BRAND_TITLE}}';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ {storeName}</Text>
        <Text style={styles.subtitle}>Powered by BoostEngine</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Welcome to your Mobile Store! 🎉</Text>
        <Text style={styles.body}>This app is built with:</Text>

        {[
          '📦 Expo SDK 51',
          '🛒 @boostengine/cart',
          '💳 @boostengine/payments',
          '🔍 @boostengine/search',
          '❤️ @boostengine/wishlist',
          '⭐ @boostengine/reviews',
          '🔔 @boostengine/notifications',
          '🔐 @boostengine/auth',
        ].map((item) => (
          <Text key={item} style={styles.listItem}>{item}</Text>
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Shopping →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#7c3aed',
    padding: 32,
    paddingTop: 64,
  },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#c4b5fd', marginTop: 4 },
  section: { padding: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  body: { color: '#555', marginBottom: 8 },
  listItem: { color: '#333', fontSize: 15, paddingVertical: 4 },
  button: {
    backgroundColor: '#7c3aed',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
