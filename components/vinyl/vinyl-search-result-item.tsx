import { SearchResultItem } from '@/api/types';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
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
  const titleTexts = item.title.split(' - ');
  const artist = titleTexts[0];
  const title = titleTexts[1];

  return (
    <Pressable style={styles.container} onPress={() => onPress(item)}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: item.cover_image }}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <View style={styles.info}>
        {/* <Text style={styles.index}>{index + 1}</Text> */}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="sub">{artist}</ThemedText>
        <View style={styles.row}>
          <ThemedText type="small">{item.formats?.[0].name}</ThemedText>
          {item.formats?.[0].text && (
            <ThemedText type="small">• {item.formats?.[0].text}</ThemedText>
          )}
        </View>
        <View style={styles.row}>
          <ThemedText type="small">{item.year}</ThemedText>
          <ThemedText type="small"> • </ThemedText>
          <ThemedText type="small">{item.country}</ThemedText>
          <ThemedText type="small"> • </ThemedText>
          <ThemedText type="small">{item.label?.[0]}</ThemedText>
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
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 5,
    overflow: 'hidden',
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
  genreContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  genre: {
    fontSize: 12,
  },
  meta: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
});
