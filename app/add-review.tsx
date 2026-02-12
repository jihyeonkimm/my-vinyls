import { MyVinyl } from '@/api/types';
import { ThemedText } from '@/components/layout/themed-text';
import StarRating from '@/components/vinyl/star-rating';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls, saveVinyl } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default function AddReviewModal() {
  const { vinylId } = useLocalSearchParams<{ vinylId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const backgroundColor = useThemeColor({}, 'background');

  const handleAdd = async () => {
    if (!vinylId) return;

    try {
      const existVinyls = await getMyVinyls();
      const isAlreadyAdded = existVinyls.some(v => v.id === Number(vinylId));

      if (isAlreadyAdded) {
        Alert.alert('알림', '이미 내 바이닐 목록에 있는 바이닐입니다.');
        return;
      }

      const myVinyl: MyVinyl = {
        id: Number(vinylId),
        rating,
        review: reviewText,
      };

      await saveVinyl(myVinyl);
      router.dismissAll();
      router.replace('/');
    } catch (error) {
      console.error('바이닐 추가 실패:', error);
      Alert.alert('오류', '바이닐을 추가하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor }]}
      onPress={Keyboard.dismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
      >
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            별점
          </ThemedText>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            감상
          </ThemedText>
          <TextInput
            style={styles.reviewInput}
            placeholder="바이닐에 대한 감상을 남겨주세요. (선택)"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            placeholderTextColor="#aaa"
          />
        </View>

        <Pressable style={styles.addButton} onPress={handleAdd}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            내 바이닐로 추가하기
          </ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  addButton: {
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3571a',
  },
  addButtonText: {
    color: '#fff',
  },
});
