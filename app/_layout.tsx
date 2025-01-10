import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, Text } from 'react-native';
import { UserProvider, useUser } from '@/context/userContext';
import auth from '@/service/auth';
import { DogProvider } from '@/context/dogContext';
import { StatusBar } from 'expo-status-bar';

function AuthenticatedLayout() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 초기 유저 정보 조회 시도
        const userData = await auth.initializeAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // 로딩은 무조건 끝냄
      }
    };

    initAuth();
  }, [setUser]);

  useEffect(() => {
    // 로딩이 끝났을 때
    if (!isLoading) {
      if (isAuthenticated) { // 로그인 상태면
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="dogs" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({});

  if (!loaded) return null;

  return (
    <UserProvider>
      <DogProvider>
        <StatusBar style='dark' />
        <AuthenticatedLayout />
      </DogProvider>
    </UserProvider>
  );
};