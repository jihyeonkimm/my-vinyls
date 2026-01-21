import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import WriteButton from '@/components/write-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { deleteVinyl, getMyVinyls } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const [myVinyls, setMyVinyls] = useState<VinylDetail[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');

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

  const handleDeleteVinyl = async (index: number) => {
    try {
      const deleteMyVinyl = await deleteVinyl(index);
      if (deleteMyVinyl) {
        console.log('바이닐 삭제 성공');
        Alert.alert('알림', '바이닐이 삭제되었습니다.');
        loadMyVinyls();
      }
    } catch (error) {
      console.error('바이닐 삭제 중 오류 발생', error);
      Alert.alert('오류', '바이닐 삭제에 실패했습니다.');
    }
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
    <View
      style={[
        styles.container,
        { backgroundColor, paddingTop: insets.top + 10 },
      ]}
    >
      <ThemedText type="title">내 바이닐 목록</ThemedText>
      {myVinyls.length > 0 ? (
        <FlatList
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
              {/* <Pressable onPress={() => handleDeleteVinyl(index)}>
                <Text>삭제</Text>
              </Pressable> */}
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
    paddingTop: 20,
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
