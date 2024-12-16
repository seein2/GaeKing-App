import { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import auth from '@/service/auth';

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await auth.getAccessToken();
      if (!token) {
        // 토큰이 없으면 /login 페이지로
        router.replace('/login');
      } else {
        // 토큰이 있으면 메인 페이지로
        router.replace('/');
      }
    } catch (error) {
      router.replace('/login'); 
    }
  };

  if (!loaded) return null;
  return <Slot />; // router에 지정된 페이지 렌더링
}