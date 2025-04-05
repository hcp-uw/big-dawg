import { Stack } from 'expo-router';

export default function SearchLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="new_exercise" options={{ headerShown: false }} />
            <Stack.Screen name="add_exercise" options={{ headerShown: false }} />
        </Stack>
    )
}