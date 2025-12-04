import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-vinyl" options={{ headerShown: false }} />
      <Stack.Screen name="info/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
