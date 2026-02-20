import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/themed-text';
import Textarea from '../ui/textarea';
import StarRating from './star-rating';

interface VinylMyReviewProps {
  myReview: {
    rating?: number;
    review?: string;
  };
  onRatingChange: (newRating: number) => void;
  onToggle: () => void;
  onInputFocus: () => void;
  isEditingReview: boolean;
  tempReview: string;
  setTempReview: (text: string) => void;
}

export default function VinylMyReview({
  myReview,
  onRatingChange,
  onToggle,
  onInputFocus,
  isEditingReview,
  tempReview,
  setTempReview,
}: VinylMyReviewProps) {
  return (
    <View style={styles.myReviewContainer}>
      <View>
        <ThemedText type="defaultSemiBold">나의 별점</ThemedText>
        <StarRating
          rating={myReview.rating || 0}
          onRatingChange={onRatingChange}
        />
      </View>
      <View>
        <View style={styles.reviewHeader}>
          <ThemedText type="defaultSemiBold">나의 리뷰</ThemedText>
          <Pressable onPress={onToggle}>
            <ThemedText type="default" style={styles.editButton}>
              {isEditingReview ? '저장' : '수정'}
            </ThemedText>
          </Pressable>
        </View>
        <Textarea
          value={isEditingReview ? tempReview : myReview.review}
          onChangeText={setTempReview}
          editable={isEditingReview}
          onFocus={onInputFocus}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  myReviewContainer: {
    marginTop: 20,
    gap: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    color: '#f3571a',
    fontSize: 14,
  },
});
