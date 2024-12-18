import { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { UserProvider, useUser } from '@/context/userContext';
import { tokenStorage } from '@/service/tokenStorage';

function AuthenticatedLayout() {
  const router = useRouter();


  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      // 토큰이 있으면 사용자 정보도 가져옴
      // const userData = await auth.getUserInfo();
      // setUser(userData); // context에 사용자 정보 설정

      router.replace('/');
    } catch (error) {
      console.error(error);
      router.replace('/login');
    }
  };

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