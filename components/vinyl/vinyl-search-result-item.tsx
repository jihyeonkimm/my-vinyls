import { SearchResultItem } from '@/api/types';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '../layout/themed-text';

interface VinylSearchResultItemProps {
  item: SearchResultItem;
  index: number;
  onPress: (item: SearchResultItem) => void;
}

export default function VinylSearchResultItem({
  item,
  index,
  onPress,
}: VinylSearchResultItemProps) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(item)}>
      <Image
        style={styles.image}
        source={{ uri: item.cover_image }}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.info}>
        {/* <Text style={styles.index}>{index + 1}</Text> */}
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <Text style={styles.meta}>{item.genre}</Text>
        {item.style && item.style.length > 0 && (
          <Text style={styles.meta}>{item.style}</Text>
        )}
        <View style={styles.row}>
          <Text style={styles.meta}>{item.year}</Text>
          <Text style={styles.meta}> / </Text>
          <Text style={styles.meta}>{item.country}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 16,
    backgroundColor: '#efefef',
  },
  image: {
    width: 60,
    height: 60,
  },
  info: {
    flex: 1,
  },
  index: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  meta: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
