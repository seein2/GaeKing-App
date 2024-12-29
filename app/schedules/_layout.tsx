import { Stack } from 'expo-router';

export default function Index() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen 
        name="register"
        options={{
          title: '강아지 등록하기',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}