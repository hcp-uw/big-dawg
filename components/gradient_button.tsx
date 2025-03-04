import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "@/src/styles/globalStyles";
import colors from "@/src/styles/themes/colors";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Allow custom styles
}

export default function GradientButton({ title, onPress, style }: GradientButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[style]}>
      <LinearGradient
        colors={[colors.BACKGROUND_COLOR, colors.BACKGROUND_COLOR]} // Gradient colors
        start={{ x: 0, y: 1 }}
        end={{ x: 0.95, y: 0 }}
        style={[styles.button, style]}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}