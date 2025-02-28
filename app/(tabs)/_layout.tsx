import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#7A6836',  // 활성화된 탭의 색상
            tabBarInactiveTintColor: '#8E8E93',  // 비활성화된 탭의 색상
            headerShown: true,  // 헤더 표시 여부
            headerShadowVisible: false, // 모든 탭의 헤더 그림자 제거
            headerTintColor: '#7A6836',
            tabBarStyle: {
              position: 'relative',
              left: 80,
              right: 80,
              elevation: 0,
              backgroundColor: '#FFFFFF',
              height: 70,
              paddingBottom: 7,
              paddingTop: 7,
            },
          }}
        >
          <Tabs.Screen
            name="index"  // 홈 화면 (index.tsx)
            options={{
              title: 'HOME',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="paw-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="schedules/index"
            options={{
              title: 'SCHEDULE',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="paw-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="sns/index"
            options={{
              title: 'SNS',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile/index"
            options={{
              title: 'PROFILE',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
              tabBarActiveTintColor: '#7A683636',
              headerStyle: {
                backgroundColor: '#E3DFD5', // 프로필 헤더 배경색 변경
                shadowOpacity: 0,
              },
              headerTintColor: '#7A6836',
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}