import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VinylInfoPage() {
  const { id } = useLocalSearchParams();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail>();

  const loadVinylDetail = async () => {
    try {
      const detail = await getVinylDetails(Number(id));
      setVinylInfo(detail);
      console.log(detail);
      return detail;
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={{ uri: vinylInfo.images?.[0].uri }} contentFit="cover" />
        <Text>{vinylInfo.artists?.[0].name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  imageContainer: {
    width: '100%',
  },
});
