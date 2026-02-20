import { Icon } from '@/components/ui/icon';
import { openDiscogs } from '@/utils/discogs';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../layout/themed-text';

interface DiscogsButtonProps {
  vinylId: number;
  color?: 'orange' | 'gray';
}

export default function DiscogsButton({
  vinylId,
  color = 'orange',
}: DiscogsButtonProps) {
  const handlePress = () => openDiscogs(vinylId);

  const backgroundColor = color === 'orange' ? '#f3571a' : '#333';

  return (
    <Pressable
      style={[styles.discogsButton, { backgroundColor }]}
      onPress={handlePress}
    >
      <Icon name="launch" size={18} color="#fff" />
      <ThemedText type="defaultSemiBold" style={styles.discogsButtonText}>
        Discogs에서 보기
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  discogsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 4,
    borderRadius: 30,
  },
  discogsButtonText: {
    color: '#fff',
  },
});
