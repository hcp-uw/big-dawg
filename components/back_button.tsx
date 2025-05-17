import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from '@/src/styles/themes/colors';

const BackButton = () => {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => router.back()} 
      style={({ pressed }) => [
        localStyles.backButton,
        pressed && localStyles.pressed
      ]}
      android_ripple={{ color: colors.PURPLE, borderless: true }}
      hitSlop={10}
    >
      <Ionicons name="arrow-back-circle-outline" size={32} color={colors.WHITE} />
    </Pressable>
  );
};

const localStyles = StyleSheet.create({
    backButton: {
        backgroundColor: colors.BLACK,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
});

export default BackButton;