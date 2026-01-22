import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { GlobalStyles } from "../../constants/Styles";
import { AniListService } from "../../services/api";
import { Anime } from "../../types/anime";

export default function AnimeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id) {
          const response = await AniListService.getAnimeDetails(Number(id));
          setAnime(response);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          GlobalStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    );
  }

  if (!anime) {
    return (
      <View
        style={[
          GlobalStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={GlobalStyles.subtitle}>Anime not found</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <ScrollView>
        <Image
          source={{ uri: anime.coverImage.extraLarge }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {anime.title.english || anime.title.romaji}
            </Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{anime.averageScore}</Text>
                <Ionicons
                  name="star"
                  size={12}
                  color={Colors.background}
                  style={{ marginLeft: 2 }}
                />
              </View>
              <View style={[styles.badge, { backgroundColor: Colors.card }]}>
                <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
                  {anime.format}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: Colors.card }]}>
                <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
                  {anime.seasonYear || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis} numberOfLines={8}>
              {anime.description?.replace(/<[^>]*>?/gm, "")}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Episodes:</Text>
              <Text style={styles.value}>{anime.episodes || "?"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{anime.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{anime.duration} mins</Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Ionicons
        name="arrow-back-circle"
        size={40}
        color="rgba(0,0,0,0.5)"
        style={styles.backButton}
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 400,
  },
  content: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    padding: 24,
    minHeight: 500,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.tint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  synopsis: {
    color: Colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    color: Colors.textSecondary,
    width: 100,
  },
  value: {
    color: Colors.text,
    fontWeight: "500",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
  },
});
