import { StyleSheet, Text, View } from 'react-native';
import WriteButton from '@/components/write-button';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>내 바이닐</Text>
      <WriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
