import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { PageHeader } from '@/components/page-header';
import { ThemedView } from '@/components/themed-view';
import WriteButton from '@/components/write-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useScrollOffset,
} from 'react-native-reanimated';

export default function Index() {
  const [myVinyls, setMyVinyls] = useState<VinylDetail[]>([]);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const scrollRef = useAnimatedRef<Animated.FlatList<VinylDetail>>();
  const scrollOffset = useScrollOffset(scrollRef);

  const loadMyVinyls = async () => {
    const savedVinyls = await getMyVinyls(); // AsyncStorage에 저장된 내 바이닐

    // 저장된 바이닐의 id로 상세 정보 불러오기
    const vinylsDetails = await Promise.all(
      savedVinyls.map(async vinyl => {
        const details = await getVinylDetails(vinyl.id);
        return {
          ...details,
          rating: vinyl.rating,
          review: vinyl.review,
        };
      })
    );

    setMyVinyls(vinylsDetails);
  };

  const handleMoveToInfoPage = (id: number) => {
    router.push(`/info/${id}`);
  };

  useFocusEffect(
    useCallback(() => {
      loadMyVinyls();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <PageHeader title="내 바이닐 목록" scrollOffset={scrollOffset} />
      {myVinyls.length > 0 ? (
        <Animated.FlatList
          ref={scrollRef}
          style={{
            width: '100%',
            maxWidth: '100%',
            flex: 1,
            height: '100%',
          }}
          contentContainerStyle={styles.listContainer}
          data={myVinyls}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.itemContainer}
              onPress={() => handleMoveToInfoPage(item.id)}
            >
              <Image
                source={{ uri: item.images?.[0].uri }}
                style={styles.image}
                contentFit="cover"
              />
              <ThemedView>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.vinylTitle}
                >
                  {item.title}
                </Text>
                <Text style={styles.artistText}>{item.artists[0].name}</Text>
              </ThemedView>
            </Pressable>
          )}
        />
      ) : (
        <View>
          <Text>아직 등록된 내 바이닐이 없어요.</Text>
          <Text>내 바이닐을 추가해보세요!</Text>
        </View>
      )}

      <WriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    width: '100%',
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  columnWrapper: {
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  itemContainer: {
    flex: 1,
    maxWidth: '49%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  vinylTitle: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistText: {
    marginTop: 4,
    color: '#666',
  },
});
