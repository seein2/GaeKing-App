import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: '홈' }}></Tabs.Screen>
      <Tabs.Screen name="profile" options={{ title: '프로필' }}></Tabs.Screen>
    </Tabs>
  );
}
