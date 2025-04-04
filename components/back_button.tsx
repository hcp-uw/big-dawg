import { useRouter } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from '@/src/styles/themes/colors';

const BackButton = () => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()} style={localStyles.backButton}>
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
});

export default BackButton;