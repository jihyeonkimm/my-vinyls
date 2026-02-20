import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { SubHeader } from '@/components/layout/sub-header';
import { ThemedText } from '@/components/layout/themed-text';
import DiscogsButton from '@/components/ui/discogs-button';
import VinylMainInfo from '@/components/vinyl/vinyl-main-info';
import VinylMoreInfo from '@/components/vinyl/vinyl-more-info';
import VinylMyReview from '@/components/vinyl/vinyl-my-review';
import VinylTracklist from '@/components/vinyl/vinyl-tracklist';
import { useThemeColor } from '@/hooks/use-theme-color';
import { deleteVinyl, getMyVinyls, updateVinyl } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useScrollOffset,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VinylInfoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail>();
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [tempReview, setTempReview] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const reviewInputRef = useRef<View>(null);
  const scrollOffset = useScrollOffset(scrollViewRef);

  const loadVinylDetail = async () => {
    try {
      const detail = await getVinylDetails(Number(id));
      const reviewData = await getMyVinyls();

      const myReview = reviewData.find(vinyl => vinyl.id === Number(id));

      const myVinylInfoData: VinylDetail = {
        ...detail,
        rating: myReview?.rating,
        review: myReview?.review,
      };

      setVinylInfo(myVinylInfoData);
      return myVinylInfoData;
    } catch (error) {
      console.error(error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      await updateVinyl(Number(id), { rating: newRating });
      setVinylInfo(prev => (prev ? { ...prev, rating: newRating } : prev));
    } catch (error) {
      console.error('별점 업데이트 실패', error);
    }
  };

  const handleEditReviewToggle = async () => {
    if (isEditingReview) {
      // 저장 모드: 변경사항을 저장
      try {
        await updateVinyl(Number(id), { review: tempReview });
        setVinylInfo(prev => (prev ? { ...prev, review: tempReview } : prev));
        setIsEditingReview(false);
      } catch (error) {
        console.error('리뷰 업데이트 실패', error);
      }
    } else {
      // 편집 모드: 현재 리뷰를 tempReview에 설정
      setTempReview(vinylInfo?.review || '');
      setIsEditingReview(true);
    }
  };

  const handleReviewInputFocus = () => {
    setTimeout(() => {
      reviewInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: y,
          animated: true,
        });
      });
    }, 100);
  };

  const handleDeleteVinyl = async () => {
    Alert.alert(
      '삭제하기',
      '이 바이닐을 내 바이닐 목록에서 삭제하시겠어요?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const success = await deleteVinyl(Number(id));
              if (success) {
                Alert.alert('알림', '삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => router.replace('/'),
                  },
                ]);
              }
            } catch (error) {
              console.error('바이닐 삭제 중 오류 발생', error);
              Alert.alert('오류', '바이닐 삭제에 실패했습니다.');
            }
          },
        },
      ],
      { cancelable: false }
    );
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
    <View style={{ flex: 1, backgroundColor }}>
      <SubHeader scrollOffset={scrollOffset} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <VinylMainInfo vinylInfo={vinylInfo} />

          <VinylTracklist tracklist={vinylInfo.tracklist} />

          <VinylMoreInfo moreInfo={vinylInfo} />

          <View ref={reviewInputRef}>
            <VinylMyReview
              myReview={vinylInfo}
              onRatingChange={handleRatingChange}
              onToggle={handleEditReviewToggle}
              onInputFocus={handleReviewInputFocus}
              isEditingReview={isEditingReview}
              tempReview={tempReview}
              setTempReview={setTempReview}
            />

            <View style={styles.buttonContainer}>
              <DiscogsButton vinylId={Number(id)} />
              <Pressable
                style={styles.deleteButton}
                onPress={handleDeleteVinyl}
              >
                <ThemedText type="default" style={styles.deleteButtonText}>
                  삭제하기
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingBottom: 40,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 4,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  deleteButtonText: {
    color: '#666',
  },
});
