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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (!token) {
          // 즉시 리다이렉트하지 않고 상태를 업데이트
          setIsLoading(false);
          return;
        }

        const userData = await auth.initializeAuth();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 인증 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    // 로딩이 완료된 후에 네비게이션 수행
    if (!isLoading) {
      const navigateBasedOnAuth = async () => {
        const token = await tokenStorage.getAccessToken();
        if (!token) {
          router.replace('/login');
        } else {
          router.replace('/');
        }
      };

      navigateBasedOnAuth();
    }
  }, [isLoading, router]);

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