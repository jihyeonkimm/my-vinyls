import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls } from '@/utils/storage';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VinylInfoPage() {
  const { id } = useLocalSearchParams();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail>();
  const backgroundColor = useThemeColor({}, 'background');

  const loadVinylDetail = async () => {
    try {
      const detail = await getVinylDetails(Number(id));
      const reviewData = await getMyVinyls();

      const myReview = reviewData.find(vinyl => vinyl.id === Number(id));

      const myVinylInfoData: VinylDetail = {
        ...detail,
        rating: myReview?.rating,
        review: myReview?.review,
      };

      setVinylInfo(myVinylInfoData);
      return myVinylInfoData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      loadVinylDetail();
    }
  }, [id]);

  if (!vinylInfo) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={{ fontSize: 10 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: vinylInfo.images?.[0].uri }}
              contentFit="cover"
              style={styles.image}
            />
          </View>
          <Text>{vinylInfo.id}</Text>
          <ThemedText
            type="title"
            style={{ textAlign: 'center', marginBottom: 6 }}
          >
            {vinylInfo.title}
          </ThemedText>
          <ThemedText type="subtitle">{vinylInfo.artists?.[0].name}</ThemedText>
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
        <View style={styles.tracklistContainer}>
          {vinylInfo.tracklist.map((track, index) => (
            <View key={`${index} - ${track.position}`} style={styles.track}>
              <View style={styles.trackTitle}>
                <ThemedText>{track.position}</ThemedText>
                <ThemedText type="defaultSemiBold">{track.title}</ThemedText>
              </View>
              <ThemedText>{track.duration}</ThemedText>
            </View>
          ))}
        </View>
        <Text>{vinylInfo.released}</Text>
        <Text>{vinylInfo.rating}</Text>
        <Text>{vinylInfo.review}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
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
    marginTop: 10,
  },
  tracklistContainer: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 20,
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#fbfbfb',
    borderRadius: 10,
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100%',
  },
  trackTitle: {
    flexDirection: 'row',
    gap: 6,
    maxWidth: '80%',
  },
  genreContainer: {
    flexDirection: 'row',
    gap: 2,
  },
});
