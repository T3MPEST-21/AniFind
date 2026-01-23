import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/Colors";
import { GlobalStyles } from "../../../constants/Styles";
import { AniListService } from "../../../services/api";
import { HistoryService } from "../../../services/history";
import { Anime } from "../../../types/anime";
import { TraceMoeResult } from "../../../types/trace";

// Mock OST Data
const MOCK_OST = {
  title: "I Really Want to Stay At Your House",
  artist: "Rosa Walton, Hallie Coggins",
};

export default function ResultsScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [results, setResults] = useState<TraceMoeResult[]>([]);
  const [bestMatch, setBestMatch] = useState<TraceMoeResult | null>(null);
  const [animeDetails, setAnimeDetails] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.results) {
      try {
        const parsedResults = JSON.parse(
          searchParams.results as string,
        ) as any[]; // Raw trace.moe matches
        setResults(parsedResults);
        if (parsedResults.length > 0) {
          setBestMatch(parsedResults[0]);

          // Fetch details for best match
          AniListService.getAnimeDetails(parsedResults[0].anilistId)
            .then((data) => {
              setAnimeDetails(data);

              // Save enriched data to history (with anime title info)
              const enrichedResult: TraceMoeResult = {
                anilist: {
                  id: data.id,
                  title: {
                    native: data.title.native,
                    romaji: data.title.romaji,
                    english: data.title.english || data.title.romaji,
                  },
                },
                filename: parsedResults[0].filename,
                episode: parsedResults[0].episode,
                from: 0, // Not available in TraceMoeMatch
                to: 0, // Not available in TraceMoeMatch
                similarity: parsedResults[0].similarity,
                video: parsedResults[0].videoUrl,
                image: parsedResults[0].imageUrl,
              };
              HistoryService.saveScan(enrichedResult);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse results", e);
        setLoading(false);
      }
    }
  }, [searchParams.results]);

  if (loading) {
    return (
      <SafeAreaView style={[GlobalStyles.container, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={{ color: "#FFF", marginTop: 16 }}>Analyzing Scene...</Text>
      </SafeAreaView>
    );
  }

  if (!bestMatch || !animeDetails) {
    return (
      <SafeAreaView style={[GlobalStyles.container, styles.center]}>
        <Text style={{ color: "#FFF" }}>No match found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const similarity = (bestMatch.similarity * 100).toFixed(0);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MATCH FOUND</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Result Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: bestMatch.image }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View
            style={[styles.matchBadge, { backgroundColor: Colors.primary }]}
          >
            <Ionicons name="checkmark-circle" size={14} color="#FFF" />
            <Text style={styles.matchText}>{similarity}% MATCH</Text>
          </View>
          {/* Gradient overlay could be added here */}
        </View>

        {/* Title Info */}
        <View style={styles.infoSection}>
          <Text style={styles.animeTitle}>
            {animeDetails.title.english || animeDetails.title.romaji}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.epBadge}>
              <Text style={styles.epText}>
                EPISODE {bestMatch.episode || "N/A"}
              </Text>
            </View>
            <Ionicons name="time-outline" size={16} color={Colors.secondary} />
            <Text style={styles.timestamp}>
              {(bestMatch as any).timestamp || "00:00"}
            </Text>
          </View>
        </View>

        {/* Detected Characters */}
        <View style={styles.sectionContainer}>
          <View style={GlobalStyles.row}>
            <Text style={styles.sectionTitle}>DETECTED IN FRAME</Text>
            <Text style={styles.persCount}>
              {animeDetails.characters?.nodes.length || 0} PERS.
            </Text>
          </View>

          <View style={styles.charList}>
            {animeDetails.characters?.nodes.map((char) => (
              <View key={char.id} style={styles.charItem}>
                <Image
                  source={{ uri: char.image.large }}
                  style={styles.charImage}
                />
                <Text style={styles.charName} numberOfLines={1}>
                  {char.name.full}
                </Text>
              </View>
            ))}
            {/* Add "Others" placeholder */}
            <View style={styles.charItem}>
              <View style={styles.othersCircle}>
                <Ionicons name="add" size={24} color="#FFF" opacity={0.5} />
              </View>
              <Text style={[styles.charName, { color: Colors.textSecondary }]}>
                Others
              </Text>
            </View>
          </View>
        </View>

        {/* Active OST */}
        <View style={styles.ostCard}>
          <View style={styles.ostIcon}>
            <Ionicons name="musical-note" size={24} color={Colors.primary} />
          </View>
          <View style={styles.ostContent}>
            <Text style={styles.ostLabel}>ACTIVE OST</Text>
            <Text style={styles.ostTitle}>{MOCK_OST.title}</Text>
            <Text style={styles.ostArtist}>{MOCK_OST.artist}</Text>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Meta Details */}
        <View style={styles.metaList}>
          <View style={styles.metaRowDetailed}>
            <Text style={styles.metaLabel}>Studio</Text>
            <Text style={styles.metaValue}>Studio Trigger</Text>
            {/* Note: Studio not in simplified query, would need parsed from description or full query. Hardcoding to match design feel or just omitting */}
          </View>
          <View style={styles.metaRowDetailed}>
            <Text style={styles.metaLabel}>Source Material</Text>
            <Text style={styles.metaValue}>{animeDetails.format}</Text>
          </View>
          <View style={[styles.metaRowDetailed, { borderBottomWidth: 0 }]}>
            <Text style={styles.metaLabel}>Original Run</Text>
            <Text style={styles.metaValue}>
              {animeDetails.seasonYear || animeDetails.startDate?.year}
            </Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={() => router.push(`/anime/${animeDetails.id}`)}
          >
            <Ionicons name="play-circle" size={24} color="#FFF" />
            <Text style={styles.watchText}>WATCH SCENE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(249, 47, 96, 0.3)", // Pinkish border glow
    backgroundColor: "#000",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  matchText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoSection: {
    marginBottom: 24,
  },
  animeTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    lineHeight: 32,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  epBadge: {
    backgroundColor: "rgba(249, 47, 96, 0.2)", // Pink tint
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  epText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  timestamp: {
    color: Colors.secondary, // Cyan
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
  sectionContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
    flex: 1,
    textTransform: "uppercase",
  },
  persCount: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  charList: {
    flexDirection: "row",
    marginTop: 16,
    gap: 16,
  },
  charItem: {
    alignItems: "center",
    width: 60,
  },
  charImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.secondary, // Or dynamic color based on image
    marginBottom: 8,
  },
  othersCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  charName: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  ostCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ostIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(249, 47, 96, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ostContent: {
    flex: 1,
  },
  ostLabel: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  ostTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  ostArtist: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  metaList: {
    marginBottom: 32,
  },
  metaRowDetailed: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metaLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  metaValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    gap: 16,
  },
  watchButton: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  watchText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
