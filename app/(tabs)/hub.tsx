import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { GlobalStyles } from "../../constants/Styles";

// Mock Data for Moods
const MOODS = [
  {
    id: "hype",
    label: "HYPE",
    subtitle: "ADRENALINE",
    icon: "flame",
    color: "#FF3D00",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-Yozwb9Ea3SOp.jpg",
  }, // Kill la kill or similar
  {
    id: "feels",
    label: "FEELS",
    subtitle: "MELANCHOLY",
    icon: "water",
    color: "#2979FF",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21519-2K375971K81r.jpg",
  }, // Your Name
  {
    id: "love",
    label: "LOVE",
    subtitle: "ROMANCE",
    icon: "heart",
    color: "#F50057",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/10165-Re910W2O3R0h.jpg",
  }, // Nichijou? No, lets use something pink
  {
    id: "chill",
    label: "CHILL",
    subtitle: "RELAXING",
    icon: "leaf",
    color: "#00E676",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/11266-4j90e1190226.jpg",
  }, // Mushishi
];

export default function MoodHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sparkles" size={24} color={Colors.secondary} />
          <Text style={styles.appName}>AniFind</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleLine1}>How are you</Text>
          <Text style={styles.titleLine2}>feeling today?</Text>
          <Text style={styles.subtitle}>
            Dive into scenes that match your vibe.
          </Text>
        </View>

        {/* Mood Grid */}
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodCard}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: mood.image }}
                style={styles.moodImage}
                contentFit="cover"
              />
              <View style={styles.moodOverlay} />
              <View style={styles.moodContent}>
                <View style={GlobalStyles.row}>
                  <Ionicons name={mood.icon as any} size={14} color="#FFF" />
                  <Text style={styles.moodSubtitle}> {mood.subtitle}</Text>
                </View>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Curated Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Curated for your <Text style={{ color: Colors.success }}>Hype</Text>{" "}
            mood
          </Text>
          <Text style={styles.seeAll}>
            See All <Ionicons name="chevron-forward" size={12} />
          </Text>
        </View>
        <Text style={styles.sectionSubtitle}>Based on recent searches</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {/* Mock Items */}
          <View style={styles.curatedCard}>
            <Image
              source={{
                uri: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WlUl60C10C5s.jpg",
              }}
              style={styles.curatedImage}
            />
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>98% Match</Text>
            </View>
            <Text style={styles.curatedTitle}>Hinokami Kagura</Text>
            <Text style={styles.curatedSubtitle}>S1:E19 • Demon Slayer</Text>
          </View>
          <View style={styles.curatedCard}>
            {/* Another mock */}
            <View style={[styles.curatedImage, { backgroundColor: "#333" }]} />
            <Text style={styles.curatedTitle}>Hollow Purple</Text>
            <Text style={styles.curatedSubtitle}>S2:E20 • JJK</Text>
          </View>
        </ScrollView>

        {/* Spacer for Tab Bar */}
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
    alignItems: "center",
    marginBottom: 32,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 8,
    flex: 1,
  },
  searchButton: {
    padding: 8,
  },
  titleSection: {
    marginBottom: 32,
  },
  titleLine1: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
  },
  titleLine2: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.success, // Using green for "feeling today?" based on image
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 16,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  moodCard: {
    width: "47%", // roughly half minus gap
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.card,
  },
  moodImage: {
    width: "100%",
    height: "100%",
  },
  moodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  moodContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  moodSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  moodLabel: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  seeAll: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  horizontalList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  curatedCard: {
    width: 280,
    marginRight: 16,
  },
  curatedImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    backgroundColor: Colors.card,
    marginBottom: 12,
  },
  matchBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  matchText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: "bold",
  },
  curatedTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  curatedSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    backgroundColor: "#333",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
