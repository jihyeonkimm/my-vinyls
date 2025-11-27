import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WriteButton() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.button}
      onPress={() => router.push('/add-vinyl')}
    >
      <Text style={styles.text}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
});
