import { SearchResponse, SearchResultItem } from '@/api/types';
import { searchVinyls } from '@/api/vinyl';
import StarRating from '@/components/star-rating';
import { saveVinyl } from '@/utils/storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddVinyl() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]); // 검색 결과 상태
  const [pagination, setPagination] = useState<
    SearchResponse['pagination'] | null
  >(null); // 페이지네이션 상태
  const [loading, setLoading] = useState<boolean>(false); // 로딩 컴포넌트 표시
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // 추가 로딩인지 여부
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태 관리
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 불러올 데이터가 있는지 여부
  const [error, setError] = useState<string | null>(null);
  const [selectedVinyl, setSelectedVinyl] = useState<SearchResultItem | null>(
    null
  ); // 선택한 바이닐
  const [selectedRating, setSelectedRating] = useState<number>(0); // 선택한 별점
  const [reviewText, setReviewText] = useState<string>(''); // 리뷰 텍스트
  const router = useRouter();

  const handleSearch = async (
    page: number = 1,
    isLoadMore: boolean = false
  ) => {
    if (!searchQuery.trim()) return;

    // 추가 로딩인지 여부
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setSearchResults([]); // 새로운 검색이면 기존 결과 초기화
      setCurrentPage(1);
      setHasMore(true);
    }

    setError(null);

    try {
      const response = await searchVinyls({
        q: searchQuery,
        type: 'release',
        format: 'vinyl',
        page: page,
        perPage: 10,
      });

      setPagination(response.pagination);

      if (isLoadMore) {
        setSearchResults(prev => [...prev, ...response.results]);
      } else {
        setSearchResults(response.results);
      }

      // page가 pages보다 크거나 같으면 마지막 페이지
      if (response.pagination.page >= response.pagination.pages) {
        setHasMore(false);
      }

      setCurrentPage(page);
    } catch (error) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      handleSearch(currentPage + 1, true);
    }
  };

  const handleAddVinyl = async () => {
    if (!selectedVinyl) return;

    const myVinyl: MyVinyl = {
      id: selectedVinyl.id.toString(),
      title: selectedVinyl.title,
      thumb: selectedVinyl.thumb,
      cover_image: selectedVinyl.cover_image,
      genre: selectedVinyl.genre,
      style: selectedVinyl.style,
      year: selectedVinyl.year,
      country: selectedVinyl.country,
      rating: selectedRating,
      review: reviewText,
    };

    try {
      const success = await saveVinyl(myVinyl);
      if (success) {
        Alert.alert('성공', '바이닐이 내 바이닐 목록에 추가되었습니다.');
        router.back();
      }
    } catch (error) {
      console.error('바이닐 추가 실패:', error);
      Alert.alert(
        '오류',
        '바이닐을 추가하는 데 실패했습니다. 다시 시도해주세요.'
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>바이닐 추가</Text>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text>닫기</Text>
        </Pressable>

        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력해주세요."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
          />
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        {searchResults.length > 0 && (
          <Text style={styles.resultCount}>
            검색 결과: {searchResults.length}개
            {pagination && ` / 전체 ${pagination.items}개`}
            {!hasMore && ' (전체)'}
          </Text>
        )}

        {searchResults.length > 0 && (
          <FlatList
            style={styles.listContainer}
            data={searchResults}
            keyExtractor={(item, index) => `${item.id} - ${index}`}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.resultItem}
                onPress={() => setSelectedVinyl(item)}
              >
                <Image
                  style={styles.resultImage}
                  source={{ uri: item.cover_image }}
                  contentFit="cover"
                  transition={1000}
                />
                <View>
                  <Text style={styles.resultTitle}>{index + 1}</Text>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultTitle}>{item.genre}</Text>
                  {item.style && item.style.length > 0 && (
                    <Text style={styles.resultTitle}>{item.style}</Text>
                  )}
                  <View style={{ flexDirection: 'row', gap: 2 }}>
                    <Text style={styles.resultTitle}>{item.year} / </Text>
                    <Text style={styles.resultTitle}>{item.country}</Text>
                  </View>
                </View>
              </Pressable>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" /> : null
            }
          />
        )}
      </View>

      <View style={styles.selectedVinylContainer}>
        {selectedVinyl ? (
          <>
            <View>
              <Text style={styles.resultTitle}>선택된 바이닐:</Text>
              <Image
                style={styles.resultImage}
                source={{ uri: selectedVinyl.cover_image }}
                contentFit="cover"
                transition={1000}
              />
              <Text style={styles.resultTitle}>{selectedVinyl.title}</Text>
              <Text style={styles.resultTitle}>{selectedVinyl.genre}</Text>
              {selectedVinyl.style && (
                <Text style={styles.resultTitle}>{selectedVinyl.style}</Text>
              )}
              <Text style={styles.resultTitle}>{selectedVinyl.year}</Text>
              <Text style={styles.resultTitle}>{selectedVinyl.country}</Text>
            </View>
            <View>
              <StarRating
                rating={selectedRating}
                onRatingChange={setSelectedRating}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="바이닐에 대한 감상을 남겨주세요."
                value={reviewText}
                onChangeText={setReviewText}
              />
              <Pressable style={{ marginTop: 10 }} onPress={handleAddVinyl}>
                <Text>내 바이닐로 추가하기</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text>바이닐을 선택해주세요.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  resultImage: {
    width: 60,
    height: 60,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  selectedVinylContainer: {
    padding: 20,
  },
});
