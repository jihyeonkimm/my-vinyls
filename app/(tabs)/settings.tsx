import { PageHeader } from '@/components/page-header';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <PageHeader title="설정" />
      <View style={styles.content}>
        <Text>설정 화면입니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
