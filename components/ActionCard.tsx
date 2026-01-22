import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
  large?: boolean;
  onPress: () => void;
}

export function ActionCard({
  title,
  subtitle,
  icon,
  color = Colors.primary,
  backgroundColor = Colors.card,
  large = false,
  onPress,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        large ? styles.large : styles.small,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, large && { marginBottom: 48 }]}>
        <Ionicons
          name={icon}
          size={large ? 48 : 32}
          color={
            large ? color : backgroundColor === Colors.primary ? "#FFF" : color
          }
        />
      </View>
      <View>
        <Text
          style={[
            styles.title,
            backgroundColor === Colors.primary && { color: "#FFF" },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            backgroundColor === Colors.primary && {
              color: "rgba(255,255,255,0.8)",
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
  },
  large: {
    flex: 1,
    height: 240,
  },
  small: {
    flex: 1,
    height: 112,
  },
  iconContainer: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
