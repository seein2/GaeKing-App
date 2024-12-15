import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'HOME' }}></Tabs.Screen>
      <Tabs.Screen name="join" options={{ title: 'JOIN' }}></Tabs.Screen>
    </Tabs>
  );
}
