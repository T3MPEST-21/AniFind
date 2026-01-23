import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
import { HistoryService } from "../../services/history";
import { TraceMoeResult } from "../../types/trace";

const COLLECTIONS = [
  {
    id: 1,
    title: "PEAK ANIME FIGHTS",
    subtitle: "24 SEQUENCES • UPDATED 2H AGO",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmJMw.jpg",
    tag: "HIGH ENERGY",
    color: "#F92F60",
  },
  {
    id: 2,
    title: "COLD VILLAIN ENTRANCES",
    subtitle: "12 CLIPS",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/10087-CgZcvD1WbZ6V.jpg",
    tag: null,
  },
  {
    id: 3,
    title: "SAVED OSTS",
    subtitle: "48 TRACKS",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-OquNCNB6srGe.jpg",
    tag: null,
  },
  {
    id: 4,
    title: "EMOTIONAL BEATS",
    subtitle: "8 CLIPS",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21519-2K375971K81r.jpg",
    tag: null,
  },
];

export default function ArchivesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "COLLECTIONS" | "RECENTS" | "IDENTIFIED"
  >("COLLECTIONS");
  const [history, setHistory] = useState<TraceMoeResult[]>([]);

  useFocusEffect(
    useCallback(() => {
      HistoryService.getHistory().then(setHistory);
    }, []),
  );
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconButton}>
            <Ionicons name="grid" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>ARCHIVES</Text>
          <View style={GlobalStyles.row}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  marginRight: 12,
                  backgroundColor: "transparent",
                  borderWidth: 0,
                },
              ]}
            >
              <Ionicons name="search" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: "https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png",
                }}
                style={styles.avatarImage}
              />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["COLLECTIONS", "RECENTS", "IDENTIFIED"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={activeTab === tab ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={
                  activeTab === tab
                    ? styles.activeTabText
                    : styles.inactiveTabText
                }
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeLine} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "COLLECTIONS" && (
          <>
            {/* Featured Collection */}
            <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
              <Image
                source={{ uri: COLLECTIONS[0].image }}
                style={styles.featuredImage}
                contentFit="cover"
              />
              <View style={styles.overlay} />
              <View style={styles.featuredContent}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{COLLECTIONS[0].tag}</Text>
                </View>
                <Text style={styles.featuredTitle}>{COLLECTIONS[0].title}</Text>
                <View style={GlobalStyles.row}>
                  <Text style={styles.featuredSubtitle}>
                    {COLLECTIONS[0].subtitle}
                  </Text>
                  <Ionicons
                    name="flash"
                    size={16}
                    color={Colors.primary}
                    style={{ marginLeft: "auto" }}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Grid Collections */}
            <View style={styles.grid}>
              {COLLECTIONS.slice(1).map((collection) => (
                <TouchableOpacity
                  key={collection.id}
                  style={styles.gridCard}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: collection.image }}
                    style={styles.gridImage}
                    contentFit="cover"
                  />
                  <View style={styles.overlay} />
                  <View style={styles.gridContent}>
                    <Text style={styles.gridTitle}>{collection.title}</Text>
                    <View style={GlobalStyles.row}>
                      <View
                        style={[
                          styles.dot,
                          !collection.tag && {
                            backgroundColor: Colors.textSecondary,
                          },
                        ]}
                      />
                      <Text style={styles.gridSubtitle}>
                        {" "}
                        {collection.subtitle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add New */}
              <TouchableOpacity style={styles.addCard}>
                <View style={styles.plusCircle}>
                  <Ionicons name="add" size={32} color="#FFF" />
                </View>
                <Text style={styles.addText}>NEW ARCHIVE</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === "RECENTS" && (
          <View style={styles.grid}>
            {history.length === 0 ? (
              <Text
                style={{
                  color: Colors.textSecondary,
                  fontStyle: "italic",
                  width: "100%",
                  textAlign: "center",
                  marginTop: 32,
                }}
              >
                No history found.
              </Text>
            ) : (
              history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridCard}
                  onPress={() => router.push(`/anime/${item.anilist.id}`)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.gridImage}
                    contentFit="cover"
                  />
                  <View style={styles.overlay} />
                  <View style={styles.gridContent}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>
                        {(item.similarity * 100).toFixed(0)}% MATCH
                      </Text>
                    </View>
                    <Text style={styles.gridTitle} numberOfLines={2}>
                      {item.anilist.title.english || item.anilist.title.romaji}
                    </Text>
                    <View style={GlobalStyles.row}>
                      <Text style={styles.gridSubtitle}>EP {item.episode}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  activeTab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  activeLine: {
    // handled by borderBottomWidth
  },
  inactiveTab: {
    paddingBottom: 12,
  },
  inactiveTabText: {
    color: Colors.textSecondary,
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  featuredCard: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  featuredContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  tagBadge: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  tagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  featuredTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900", // extra bold
    textTransform: "uppercase",
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  gridCard: {
    width: "47%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.card,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  gridTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 4,
  },
  gridSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "bold",
  },
  addCard: {
    width: "47%",
    height: 180,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  plusCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  addText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
