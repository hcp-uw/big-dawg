import { Stack } from 'expo-router';
import colors from '@/src/styles/themes/colors';
import { styles } from '@/src/styles/globalStyles'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}