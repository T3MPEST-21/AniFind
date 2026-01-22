import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { Anime } from "../types/anime";

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
  width?: number;
  height?: number;
}

export function AnimeCard({
  anime,
  onPress,
  width = 140,
  height = 200,
}: AnimeCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/anime/${anime.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.container, { width }]}
    >
      <Image
        source={{ uri: anime.coverImage.extraLarge }}
        style={[styles.image, { width, height }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {anime.title.english || anime.title.romaji}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{anime.averageScore || "N/A"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  textContainer: {
    paddingVertical: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  scoreContainer: {
    position: "absolute",
    top: -195, // Overlay on image
    right: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  score: {
    color: Colors.tint,
    fontSize: 12,
    fontWeight: "bold",
  },
});
