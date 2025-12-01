import { MyVinyl } from '@/api/types';
import WriteButton from '@/components/write-button';
import { getMyVinyls } from '@/utils/storage';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [myVinyls, setMyVinyls] = useState<MyVinyl[]>([]);

  const loadMyVinyls = async () => {
    const vinyls = await getMyVinyls();
    setMyVinyls(vinyls);
  };

  useEffect(() => {
    loadMyVinyls();
  }, [myVinyls]);

  return (
    <SafeAreaView style={styles.container}>
      {myVinyls.length > 0 ? (
        <FlatList
          style={{ width: '100%' }}
          data={myVinyls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.myVinylContainer}>
              <Image
                source={{ uri: item.thumb }}
                style={{ width: 100, height: 100 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, flexShrink: 1 }}>
                <Text>{item.title}</Text>
                {item.review && <Text>{item.review}</Text>}
              </View>
            </View>
          )}
        />
      ) : (
        <View>
          <Text>아직 등록된 내 바이닐이 없어요.</Text>
          <Text>내 바이닐을 추가해보세요!</Text>
        </View>
      )}

      <WriteButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myVinylContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
