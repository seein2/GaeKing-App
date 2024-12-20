import { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, Text } from 'react-native';
import { UserProvider, useUser } from '@/context/userContext';
import { tokenStorage } from '@/service/tokenStorage';
import auth from '@/service/auth';

function AuthenticatedLayout() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await tokenStorage.getAccessToken();

        if (!token) {
          setIsLoading(false);
          setIsAuthenticated(false);
          return;
        }

        const userData = await auth.initializeAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true); // 로그인
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
        console.log(isAuthenticated);
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
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({});

  if (!loaded) return null;

  return (
    <UserProvider>
      <AuthenticatedLayout />
    </UserProvider>
  );
}