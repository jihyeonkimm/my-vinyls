import WriteButton from '@/components/write-button';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>아직 등록된 내 바이닐이 없어요.</Text>
      <Text>내 바이닐을 추가해보세요!</Text>
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
