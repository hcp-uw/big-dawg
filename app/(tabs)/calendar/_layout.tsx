import { Stack } from 'expo-router';

export default function CalendarLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="day_workout" options={{ headerShown: false }} />
        </Stack>
    )
}