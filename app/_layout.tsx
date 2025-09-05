// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();

  // You can add authentication logic here
  useEffect(() => {
    // For example, check if user is authenticated and navigate accordingly
    // This is just a placeholder - implement your actual auth logic
    const checkAuth = async () => {
      // const isAuthenticated = await checkIfUserIsLoggedIn();
      // if (isAuthenticated) {
      //   router.replace('/(main)/Home');
      // } else {
      //   router.replace('/(auth)/LoginScreen');
      // }
    };
    
    // checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1e2a38' }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
