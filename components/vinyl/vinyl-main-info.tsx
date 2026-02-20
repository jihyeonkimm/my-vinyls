import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/themed-text';
import { ThemedView } from '../layout/themed-view';

interface VinylMainInfoProps {
  vinylInfo: {
    images?: { uri: string }[];
    title: string;
    artists: { name: string }[];
    year?: string;
    country?: string;
    genres?: string[];
  };
}

export default function VinylMainInfo({ vinylInfo }: VinylMainInfoProps) {
  return (
    <ThemedView style={styles.infoContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vinylInfo.images?.[0].uri }}
          contentFit="cover"
          style={styles.image}
        />
      </View>
      <ThemedText
        type="subtitle"
        style={{ textAlign: 'center', marginBottom: 6 }}
      >
        {vinylInfo.title}
      </ThemedText>
      <ThemedText type="sub" style={{ color: '#f3571a' }}>
        {vinylInfo.artists?.[0].name}
      </ThemedText>
      <View style={styles.subInfoContainer}>
        <ThemedText type="small">{vinylInfo.year} •</ThemedText>
        <ThemedText type="small">{vinylInfo.country} •</ThemedText>
        {vinylInfo.genres?.map((genre, index) => (
          <View key={`${index} - ${genre}`} style={styles.genreContainer}>
            <ThemedText type="small">{genre}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 230,
    height: 230,
    borderRadius: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#949494',
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowRadius: 15,
      },
      android: {
        shadowColor: '#949494',
        elevation: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  subInfoContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    gap: 2,
  },
});
