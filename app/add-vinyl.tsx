import { MyVinyl, SearchResponse, SearchResultItem } from '@/api/types';
import { searchVinyls } from '@/api/vinyl';
import StarRating from '@/components/star-rating';
import { getMyVinyls, saveVinyl } from '@/utils/storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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

    const existVinyl = await getMyVinyls();

    const isAlreadyAdded = existVinyl.some(
      vinyl => vinyl.id === selectedVinyl.id
    );

    if (isAlreadyAdded) {
      Alert.alert('알림', '이미 내 바이닐 목록에 추가된 바이닐입니다.');
      return;
    }

    const myVinyl: MyVinyl = {
      id: selectedVinyl.id,
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력해주세요."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
          />
        </View>

        {searchResults.length > 0 && (
          <Text style={styles.resultCount}>
            검색 결과: {searchResults.length}개
            {pagination && ` / 전체 ${pagination.items}개`}
            {!hasMore && ' (전체)'}
          </Text>
        )}

        <View style={{ flex: 1 }}>
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
      </KeyboardAvoidingView>

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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingVertical: 5,
  },
  listContainer: {},
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'pink',
  },
  resultTitle: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
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
