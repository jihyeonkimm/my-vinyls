import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../ui/icon';

interface SubHeaderProps {
  scrollOffset?: SharedValue<number>;
}

export function SubHeader({ scrollOffset }: SubHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollOffset) {
      return {
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
      };
    }

    const opacity = interpolate(scrollOffset.value, [0, 10], [0, 1], 'clamp');

    return {
      borderBottomWidth: 1,
      borderBottomColor: `rgba(234, 234, 234, ${opacity})`,
    };
  });

  return (
    <Animated.View
      style={[styles.container, { paddingTop: insets.top + 6 }, animatedStyle]}
    >
      <Pressable onPress={() => router.back()}>
        <Icon
          name="arrow-back"
          size={28}
          style={{ marginLeft: 20, marginTop: 10 }}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
});
