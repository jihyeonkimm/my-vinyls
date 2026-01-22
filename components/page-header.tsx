import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageHeaderProps {
  title: string;
  scrollOffset?: SharedValue<number>;
}

export function PageHeader({ title, scrollOffset }: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');

  // 스크롤 위치에 따른 border opacity 계산
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
      style={[
        styles.container,
        { backgroundColor, paddingTop: insets.top + 6 },
        animatedStyle,
      ]}
    >
      <ThemedText type="title">{title}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
