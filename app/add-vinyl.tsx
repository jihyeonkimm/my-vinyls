import { SearchResponse } from '@/api/types';
import { searchVinyls } from '@/api/vinyl';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddVinyl() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchVinyls({
        q: searchQuery,
        type: 'release',
        format: 'vinyl',
      });
      console.log(results.length);
      setSearchResults(results);
    } catch (error) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(error);
    } finally {
      setLoading(false);
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
            onSubmitEditing={handleSearch}
          />
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        {searchResults && Array.isArray(searchResults) && (
          <Text style={styles.resultCount}>
            검색 결과: {searchResults.length}개
          </Text>
        )}

        {searchResults && (
          <FlatList
            style={styles.listContainer}
            data={searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable style={styles.resultItem}>
                <Image
                  style={styles.resultImage}
                  source={{ uri: item.thumb }}
                  contentFit="cover"
                  transition={1000}
                />
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultTitle}>{item.genre}</Text>
                <Text style={styles.resultTitle}>{item.style}</Text>
                <Text style={styles.resultTitle}>{item.year}</Text>
                <Text style={styles.resultTitle}>{item.country}</Text>
              </Pressable>
            )}
          />
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
    width: 100,
    height: 100,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
});
