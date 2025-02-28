import { Stack } from 'expo-router';

export default function Index() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E3DFD5',
        },
        headerTintColor: '#7A6836',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="register"
        options={{
          title: 'DOG REGISTER',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: 'DOG PROFILE',
        }}
      />
      <Stack.Screen
        name="register-code"
        options={{
          title: '초대 코드로 참여하기',
          headerTintColor: '#E3DFD5',
        }}
      />
    </Stack>
  );
}