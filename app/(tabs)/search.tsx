import { SearchResponse, SearchResultItem } from '@/api/types';
import { searchVinyls } from '@/api/vinyl';
import { PageHeader } from '@/components/layout/page-header';
import { ThemedText } from '@/components/layout/themed-text';
import Input from '@/components/ui/input';
import VinylSearchResultItem from '@/components/vinyl/vinyl-search-result-item';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [pagination, setPagination] = useState<
    SearchResponse['pagination'] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const router = useRouter();

  const handleSearch = async (
    page: number = 1,
    isLoadMore: boolean = false
  ) => {
    if (!searchQuery.trim()) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setSearchResults([]);
      setCurrentPage(1);
      setHasMore(true);
    }

    setError(null);

    try {
      const response = await searchVinyls({
        q: searchQuery,
        type: 'release',
        format: 'vinyl',
        page,
        perPage: 10,
      });

      setPagination(response.pagination);

      if (isLoadMore) {
        setSearchResults(prev => [...prev, ...response.results]);
      } else {
        setSearchResults(response.results);
      }

      if (response.pagination.page >= response.pagination.pages) {
        setHasMore(false);
      }

      setCurrentPage(page);
    } catch (e) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Search Error:', e);
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

  const handleSelectVinyl = (item: SearchResultItem) => {
    router.push(`/vinyl/${item.id}`);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setPagination(null);
    setHasMore(true);
    setCurrentPage(1);
    setError(null);
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor }]}
      onPress={Keyboard.dismiss}
    >
      <PageHeader title="검색" />
      <View style={styles.inputContainer}>
        <Input
          placeholder="아티스트, 앨범명으로 검색"
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            if (text.trim() === '') {
              handleClearSearch();
            }
          }}
          onSubmitEditing={() => handleSearch()}
          onClear={handleClearSearch}
          returnKeyType="search"
          showSearchIcon
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText type="sub">{error}</ThemedText>
        </View>
      )}

      {!loading && searchResults.length > 0 && (
        <>
          <ThemedText type="sub" style={styles.resultCount}>
            {pagination && `전체 ${pagination.items}개`}
            {!hasMore && ' (전체)'}
          </ThemedText>
          <FlatList
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            data={searchResults}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, index }) => (
              <VinylSearchResultItem
                item={item}
                index={index}
                onPress={handleSelectVinyl}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" style={styles.footerLoader} />
              ) : null
            }
          />
        </>
      )}

      {!loading && !error && searchResults.length === 0 && (
        <View style={styles.noContentContainer}>
          <ThemedText type="default">검색 결과가 없습니다.</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 14,
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 16,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
