import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="info/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="vinyl/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-review"
          options={{
            presentation: 'modal',
            title: '바이닐 추가하기',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#ffffff',
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
                <Text style={{ fontSize: 16, color: '#757575' }}>취소</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
