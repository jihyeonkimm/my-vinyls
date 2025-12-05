import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

export default function WriteButton() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Pressable
      style={[styles.button, { backgroundColor: tintColor }]}
      onPress={() => router.push('/add-vinyl')}
    >
      <ThemedText type="defaultSemiBold" style={styles.text}>
        내 바이닐 추가하기
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -80 }],
    width: 160,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2f2f2f',
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowRadius: 15,
      },
      android: {
        shadowColor: '#2f2f2f',
        elevation: 8,
      },
    }),
  },
  text: {
    color: '#ffffff',
  },
});
