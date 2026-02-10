import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-vinyl"
          options={{
            presentation: 'modal',
            title: '바이닐 등록하기',
            headerStyle: {
              backgroundColor: '#f4f3f4',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
              color: '#333',
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ paddingLeft: 2 }}
              >
                <Text style={{ fontSize: 16 }}>취소</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="info/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
