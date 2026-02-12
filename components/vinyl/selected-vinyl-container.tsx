import { SearchResultItem } from '@/api/types';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StarRating from './star-rating';

interface SelectedVinylContainerProps {
  selectedVinyl: SearchResultItem;
  selectedRating?: number | undefined;
  setSelectedRating?: (rating: number) => void;
  reviewText?: string;
  setReviewText?: (text: string) => void;
  handleAddVinyl?: () => void;
}

export default function SelectedVinylContainer({
  selectedVinyl,
  selectedRating,
  setSelectedRating,
  reviewText,
  setReviewText,
  handleAddVinyl,
}: SelectedVinylContainerProps) {
  return (
    <View style={styles.selectedVinylContainer}>
      <View>
        <Text>선택된 바이닐:</Text>
        <Image
          source={{ uri: selectedVinyl.cover_image }}
          contentFit="cover"
          transition={1000}
        />
        <Text>{selectedVinyl.title}</Text>
        <Text>{selectedVinyl.genre}</Text>
        {selectedVinyl.style && <Text>{selectedVinyl.style}</Text>}
        <Text>{selectedVinyl.year}</Text>
        <Text>{selectedVinyl.country}</Text>
      </View>
      <View>
        <StarRating
          rating={selectedRating || 0}
          onRatingChange={setSelectedRating || (() => {})}
        />
        <TextInput
          placeholder="바이닐에 대한 감상을 남겨주세요."
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />
        <Pressable style={{ marginTop: 10 }} onPress={handleAddVinyl}>
          <Text>내 바이닐로 추가하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedVinylContainer: {
    padding: 20,
  },
});
