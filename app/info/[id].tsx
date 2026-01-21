import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import StarRating from '@/components/star-rating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls, updateVinyl } from '@/utils/storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VinylInfoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail>();
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [tempReview, setTempReview] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const scrollViewRef = useRef<ScrollView>(null);
  const reviewInputRef = useRef<View>(null);

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
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View>
        <Pressable onPress={() => router.back()}>
          <Icon
            name="arrow-back"
            size={28}
            style={{ marginLeft: 20, marginTop: 10 }}
          />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.infoContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: vinylInfo.images?.[0].uri }}
                contentFit="cover"
                style={styles.image}
              />
            </View>
            <Text>{vinylInfo.id}</Text>
            <ThemedText
              type="subtitle"
              style={{ textAlign: 'center', marginBottom: 6 }}
            >
              {vinylInfo.title}
            </ThemedText>
            <ThemedText type="sub" style={{ color: '#f3571a' }}>
              {vinylInfo.artists?.[0].name}
            </ThemedText>
            <View style={styles.subInfoContainer}>
              <ThemedText type="small">{vinylInfo.year} •</ThemedText>
              <ThemedText type="small">{vinylInfo.country} •</ThemedText>
              {vinylInfo.genres?.map((genre, index) => (
                <View key={`${index} - ${genre}`} style={styles.genreContainer}>
                  <ThemedText type="small">{genre}</ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
          <View style={styles.tracklistContainer}>
            {vinylInfo.tracklist.map((track, index) => {
              const isLastItem = index === vinylInfo.tracklist.length - 1;
              return (
                <View key={`${index} - ${track.position}`} style={styles.track}>
                  <View style={styles.trackTitle}>
                    <ThemedText type="sub" style={styles.trackPositionText}>
                      {track.position}
                    </ThemedText>
                    <ThemedText
                      type="default"
                      style={[
                        track.type_ === 'heading'
                          ? styles.headingText
                          : styles.trackTitleText,
                        isLastItem && { borderBottomWidth: 0 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {track.title}
                    </ThemedText>
                  </View>
                  {/* <ThemedText>{track.duration}</ThemedText> */}
                </View>
              );
            })}
          </View>
          <View style={styles.moreInfoContainer}>
            <ThemedText type="small">발매일 : {vinylInfo.released}</ThemedText>
            <View style={styles.labelsContainer}>
              <ThemedText type="small">레이블 :</ThemedText>
              {vinylInfo.labels &&
                vinylInfo.labels.length > 0 &&
                vinylInfo.labels.map((label, index) => (
                  <ThemedText
                    key={`${label.catno} - ${label.id} - ${index}`}
                    type="small"
                  >
                    {label.name} - {label.catno}
                    {index < vinylInfo.labels!.length - 1 ? ',' : ''}
                  </ThemedText>
                ))}
            </View>
            <View style={styles.formatContainer}>
              <ThemedText type="small">
                형식 : {vinylInfo.formats?.[0].name},
              </ThemedText>
              {vinylInfo.formats?.[0].descriptions.map((desc, index) => (
                <ThemedText key={index} type="small">
                  {desc}
                  {index < vinylInfo.formats[0].descriptions.length - 1 ||
                  vinylInfo.formats?.[0].text
                    ? ','
                    : ''}
                </ThemedText>
              ))}
              <ThemedText type="small">
                {vinylInfo.formats?.[0].text}
              </ThemedText>
            </View>
          </View>
          <View style={styles.myReviewContainer} ref={reviewInputRef}>
            <View>
              <ThemedText type="defaultSemiBold">나의 별점</ThemedText>
              <StarRating
                rating={vinylInfo.rating || 0}
                onRatingChange={handleRatingChange}
              />
            </View>
            <View>
              <View style={styles.reviewHeader}>
                <ThemedText type="defaultSemiBold">나의 리뷰</ThemedText>
                <Pressable onPress={handleEditReviewToggle}>
                  <ThemedText type="default" style={styles.editButton}>
                    {isEditingReview ? '저장' : '수정'}
                  </ThemedText>
                </Pressable>
              </View>
              <TextInput
                style={styles.reviewInput}
                value={isEditingReview ? tempReview : vinylInfo.review}
                onChangeText={setTempReview}
                editable={isEditingReview}
                multiline
                placeholder="리뷰를 작성해주세요"
                onFocus={handleReviewInputFocus}
              />
            </View>
            <Pressable
              style={[styles.deleteButton, { backgroundColor: tintColor }]}
              onPress={() => {}}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                삭제하기
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  infoContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 230,
    height: 230,
    borderRadius: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#949494',
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowRadius: 15,
      },
      android: {
        shadowColor: '#949494',
        elevation: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  subInfoContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tracklistContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100%',
    paddingHorizontal: 4,
  },
  trackTitle: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    maxWidth: '100%',
  },
  trackPositionText: {
    flexShrink: 0,
    width: 26,
    paddingVertical: 12,
  },
  headingText: {
    paddingVertical: 12,
    fontWeight: 500,
  },
  trackTitleText: {
    flexGrow: 1,
    maxWidth: '90%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  genreContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  moreInfoContainer: {
    marginTop: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 3,
    maxWidth: '100%',
  },
  formatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 3,
    maxWidth: '100%',
  },
  myReviewContainer: {
    marginTop: 20,
    paddingBottom: 400,
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
  reviewInput: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  deleteButton: {
    width: 160,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
});
