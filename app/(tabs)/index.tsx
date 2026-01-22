import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionCard } from "../../components/ActionCard";
import { PulseItem } from "../../components/PulseItem";
import { Colors } from "../../constants/Colors";
import { GlobalStyles } from "../../constants/Styles";
import { AniListService } from "../../services/api";
import { Anime } from "../../types/anime";

// Mock Data for "Trending Pulses" (until we have a real music API)
const TRENDING_PULSES = [
  {
    rank: "01",
    title: "Oshi no Ko S2 OP",
    subtitle: "Identified 4.2k times today",
    bars: [0.3, 0.6, 0.4, 0.8, 0.5],
  },
  {
    rank: "02",
    title: "Solo Leveling Ep 7 OST",
    subtitle: "Identified 2.8k times today",
    bars: [0.2, 0.5, 0.8, 0.4, 0.6],
  },
  {
    rank: "03",
    title: "Bling-Bang-Bang-Born",
    subtitle: "Identified 1.5k times today",
    bars: [0.7, 0.9, 0.3, 0.5, 0.8],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [recents, setRecents] = useState<Anime[]>([]);

  useEffect(() => {
    // Fetch some "trending" to fill "Recent Sightings" for now
    AniListService.getTrending(1, 5).then((data) => setRecents(data));
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={20} color={Colors.primary} />
              {/* Image mockup would go here */}
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>9</Text>
              </View>
            </View>
            <View>
              <Text style={styles.greeting}>Sync Level 42</Text>
              <Text style={styles.username}>Kyo_Watcher</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Title */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitleItalic}>IDENTIFY</Text>
          <Text style={styles.heroTitleBold}>ANYTHING.</Text>
          <Text style={styles.heroSubtitle}>
            Access the global anime database instantly through sight and sound.
          </Text>
        </View>

        {/* Action Grid */}
        <View style={styles.gridContainer}>
          {/* Left Col: Visual Scan (Large) */}
          <View style={styles.gridLeft}>
            <ActionCard
              title="Visual Scan"
              subtitle="Identify via screenshot"
              icon="camera"
              large
              backgroundColor={Colors.card}
              color={Colors.primary}
              onPress={() => router.push("/scan")}
            />
          </View>
          {/* Right Col: Scene & Melody */}
          <View style={styles.gridRight}>
            <ActionCard
              title="Scene"
              subtitle="Video Upload"
              icon="film"
              color={Colors.secondary}
              backgroundColor={Colors.card}
              onPress={() => router.push("/scan")}
            />
            <ActionCard
              title="Melody"
              subtitle="OST Finder"
              icon="musical-notes"
              color="#FFF"
              backgroundColor={Colors.primary}
              onPress={() => router.push("/audio")}
            />
          </View>
        </View>

        {/* Recent Sightings */}
        <View style={styles.section}>
          <View style={GlobalStyles.row}>
            <View style={styles.statusDot} />
            <Text style={styles.sectionTitle}>RECENT SIGHTINGS</Text>
          </View>
          <Text style={styles.viewHistory}>VIEW HISTORY</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {recents.map((anime, index) => (
            <TouchableOpacity
              key={anime.id}
              style={styles.recentCard}
              onPress={() => router.push(`/anime/${anime.id}`)}
            >
              <Image
                source={{ uri: anime.coverImage.extraLarge }}
                style={styles.recentImage}
              />
              <View style={styles.recentOverlay}>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>
                    {(98 - index * 2.3).toFixed(1)}% MATCH
                  </Text>
                </View>
              </View>
              <Text style={styles.recentTitle} numberOfLines={1}>
                {anime.title.english || anime.title.romaji}
              </Text>
              <Text style={styles.recentSubtitle}>
                EPISODE {12 - index} • 14:2{index}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Pulses */}
        <View style={[styles.section, { marginTop: 24 }]}>
          <View style={GlobalStyles.row}>
            <View
              style={[styles.statusDot, { backgroundColor: Colors.secondary }]}
            />
            <Text style={styles.sectionTitle}>TRENDING PULSES</Text>
          </View>
        </View>

        <View style={styles.verticalList}>
          {TRENDING_PULSES.map((track, i) => (
            <PulseItem
              key={i}
              rank={track.rank}
              title={track.title}
              subtitle={track.subtitle}
              bars={track.bars}
            />
          ))}
        </View>

        {/* Spacer for Floating Tab Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(249, 47, 96, 0.1)", // Tint opacity
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  levelBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  levelText: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.background,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  username: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTitleItalic: {
    fontSize: 32,
    fontStyle: "italic",
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 32,
  },
  heroTitleBold: {
    fontSize: 32,
    fontWeight: "800",
    fontStyle: "italic",
    color: Colors.primary,
    lineHeight: 32,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: "80%",
  },
  gridContainer: {
    flexDirection: "row",
    height: 240,
    gap: 12,
    marginBottom: 40,
  },
  gridLeft: {
    flex: 1.2,
  },
  gridRight: {
    flex: 0.8,
    gap: 12,
    justifyContent: "space-between",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#FFF",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  viewHistory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  horizontalList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  recentCard: {
    width: 280,
    marginRight: 16,
  },
  recentImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
  recentOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  matchBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  matchText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  recentTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  recentSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
  },
  verticalList: {
    gap: 0,
  },
});
