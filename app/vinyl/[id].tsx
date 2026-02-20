import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { SubHeader } from '@/components/layout/sub-header';
import { ThemedText } from '@/components/layout/themed-text';
import DiscogsButton from '@/components/ui/discogs-button';
import VinylMainInfo from '@/components/vinyl/vinyl-main-info';
import VinylMoreInfo from '@/components/vinyl/vinyl-more-info';
import VinylTracklist from '@/components/vinyl/vinyl-tracklist';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls, getWishlist, saveWishlistItem } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function VinylDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail | null>(null);
  const [isInMyVinyls, setIsInMyVinyls] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const backgroundColor = useThemeColor({}, 'background');
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollViewRef);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const [detail, myVinyls, wishlist] = await Promise.all([
          getVinylDetails(Number(id)),
          getMyVinyls(),
          getWishlist(),
        ]);
        setVinylInfo(detail);
        setIsInMyVinyls(myVinyls.some(v => v.id === Number(id)));
        setIsInWishlist(wishlist.some(w => w.id === Number(id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddToMyVinyls = () => {
    router.push(`/add-review?vinylId=${id}`);
  };

  const handleAddToWishlist = async () => {
    try {
      await saveWishlistItem({ id: Number(id) });
      setIsInWishlist(true);
      Alert.alert('완료', '위시리스트에 추가되었습니다.');
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '위시리스트 추가에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <SubHeader scrollOffset={scrollOffset} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!vinylInfo) {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <SubHeader scrollOffset={scrollOffset} />
        <View style={styles.loadingContainer}>
          <Text>바이닐 정보가 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <SubHeader scrollOffset={scrollOffset} />
      <Animated.ScrollView ref={scrollViewRef} style={styles.container}>
        <VinylMainInfo vinylInfo={vinylInfo} />

        <VinylTracklist tracklist={vinylInfo.tracklist} />

        <VinylMoreInfo moreInfo={vinylInfo} />

        <View style={styles.actionContainer}>
          <Pressable
            style={[
              styles.primaryButton,
              isInMyVinyls && styles.disabledButton,
            ]}
            onPress={handleAddToMyVinyls}
            disabled={isInMyVinyls}
          >
            <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
              {isInMyVinyls
                ? '이미 내 바이닐에 있어요'
                : '내 바이닐에 추가하기'}
            </ThemedText>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              isInWishlist && styles.disabledButton,
            ]}
            onPress={handleAddToWishlist}
            disabled={isInWishlist}
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.secondaryButtonText}
            >
              {isInWishlist
                ? '위시리스트에 담겨있어요'
                : '위시리스트에 추가하기'}
            </ThemedText>
          </Pressable>

          <DiscogsButton vinylId={Number(id)} color="gray" />
        </View>
        <View></View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  artist: {
    color: '#f3571a',
  },
  subInfoContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tracklistContainer: {
    marginTop: 20,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  trackTitle: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  trackPosition: {
    flexShrink: 0,
    width: 26,
    paddingVertical: 12,
  },
  headingText: {
    paddingVertical: 12,
    fontWeight: '500',
  },
  trackTitleText: {
    flexGrow: 1,
    maxWidth: '90%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  moreInfoContainer: {
    marginTop: 20,
    gap: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 3,
  },
  actionContainer: {
    marginTop: 32,
    paddingBottom: 48,
    gap: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3571a',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f3571a',
  },
  secondaryButtonText: {
    color: '#f3571a',
  },
  disabledButton: {
    opacity: 0.4,
  },
});
