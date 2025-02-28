// app/schedules/_layout.tsx
import { Stack } from 'expo-router';

export default function ScheduleLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTitle: 'DETAIL',
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: '일정 목록',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: '일정 상세',
                }}
            />
            {/* 다른 스크린 필요시 추가 */}
        </Stack>
    );
}