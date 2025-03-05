import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit_workout" options={{ headerShown: false }} />
      <Stack.Screen name="add_workout" options={{ headerShown: false }} />
    </Stack>
  );
}
