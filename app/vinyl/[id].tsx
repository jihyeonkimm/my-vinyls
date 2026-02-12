import { VinylDetail } from '@/api/types';
import { getVinylDetails } from '@/api/vinyl';
import { SubHeader } from '@/components/layout/sub-header';
import { ThemedText } from '@/components/layout/themed-text';
import { ThemedView } from '@/components/layout/themed-view';
import { Icon } from '@/components/ui/icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getMyVinyls, getWishlist, saveWishlistItem } from '@/utils/storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
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

export default function VinylDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vinylInfo, setVinylInfo] = useState<VinylDetail | null>(null);
  const [isInMyVinyls, setIsInMyVinyls] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollViewRef);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
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

  const handleOpenDiscogs = async () => {
    const url = `https://www.discogs.com/release/${id}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };

  if (!vinylInfo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <SubHeader />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <SubHeader scrollOffset={scrollOffset} />
      <Animated.ScrollView ref={scrollViewRef} style={styles.container}>
        <ThemedView style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: vinylInfo.images?.[0].uri }}
              contentFit="cover"
              style={styles.image}
            />
          </View>
          <ThemedText type="subtitle" style={styles.title}>
            {vinylInfo.title}
          </ThemedText>
          <ThemedText type="sub" style={styles.artist}>
            {vinylInfo.artists?.[0].name}
          </ThemedText>
          <View style={styles.subInfoContainer}>
            {vinylInfo.year && (
              <ThemedText type="small">{vinylInfo.year} •</ThemedText>
            )}
            {vinylInfo.country && (
              <ThemedText type="small">{vinylInfo.country} •</ThemedText>
            )}
            {vinylInfo.genres?.map((genre, index) => (
              <ThemedText key={`${index}-${genre}`} type="small">
                {genre}
              </ThemedText>
            ))}
          </View>
        </ThemedView>

        <View style={styles.tracklistContainer}>
          {vinylInfo.tracklist.map((track, index) => {
            const isLastItem = index === vinylInfo.tracklist.length - 1;
            return (
              <View key={`${index}-${track.position}`} style={styles.track}>
                <View style={styles.trackTitle}>
                  <ThemedText type="sub" style={styles.trackPosition}>
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
              </View>
            );
          })}
        </View>

        <View style={styles.moreInfoContainer}>
          {vinylInfo.released && (
            <ThemedText type="small">발매일 : {vinylInfo.released}</ThemedText>
          )}
          {vinylInfo.labels && vinylInfo.labels.length > 0 && (
            <View style={styles.labelsContainer}>
              <ThemedText type="small">레이블 :</ThemedText>
              {vinylInfo.labels.map((label, index) => (
                <ThemedText key={`${label.catno}-${label.id}`} type="small">
                  {label.name} - {label.catno}
                  {index < vinylInfo.labels!.length - 1 ? ',' : ''}
                </ThemedText>
              ))}
            </View>
          )}
        </View>

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
              {isInMyVinyls ? '이미 내 바이닐에 있어요' : '내 바이닐에 추가하기'}
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
              {isInWishlist ? '위시리스트에 담겨있어요' : '위시리스트에 추가하기'}
            </ThemedText>
          </Pressable>

          <Pressable style={styles.discogsButton} onPress={handleOpenDiscogs}>
            <Icon name="launch" size={18} color="#fff" />
            <ThemedText type="defaultSemiBold" style={styles.discogsButtonText}>
              Discogs에서 보기
            </ThemedText>
          </Pressable>
        </View>
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
  discogsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 4,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  discogsButtonText: {
    color: '#fff',
  },
});
