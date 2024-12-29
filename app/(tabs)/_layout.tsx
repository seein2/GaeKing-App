import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',  // 활성화된 탭의 색상
        tabBarInactiveTintColor: '#8E8E93',  // 비활성화된 탭의 색상
        headerShown: true,  // 헤더 표시 여부
      }}
    >
      <Tabs.Screen
        name="index"  // 홈 화면 (index.tsx)
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="schedules/index"
        options={{
          title: '스케쥴관리',
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
          title: '프로필',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}