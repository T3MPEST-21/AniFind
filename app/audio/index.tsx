import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { GlobalStyles } from "../../constants/Styles";

export default function AudioSearchScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [rippleScale, setRippleScale] = useState(1);

  // Mock Animation for listening
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isListening) {
      interval = setInterval(() => {
        setRippleScale((prev) => (prev >= 1.5 ? 1 : prev + 0.1));
      }, 100);
    } else {
      setRippleScale(1);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AUDIO SEARCH</Text>
        <TouchableOpacity>
          <Ionicons name="time-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Listening Circle */}
      <View style={styles.listeningContainer}>
        {isListening && (
          <>
            <View
              style={[
                styles.ripple,
                { transform: [{ scale: rippleScale * 1.5 }], opacity: 0.1 },
              ]}
            />
            <View
              style={[
                styles.ripple,
                { transform: [{ scale: rippleScale * 1.2 }], opacity: 0.3 },
              ]}
            />
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsListening(!isListening)}
          style={[
            styles.listenButton,
            isListening && {
              borderColor: Colors.secondary,
              shadowColor: Colors.secondary,
              shadowOpacity: 0.5,
              shadowRadius: 20,
            },
          ]}
        >
          <Ionicons
            name={isListening ? "mic" : "mic-outline"}
            size={64}
            color={Colors.secondary}
          />
        </TouchableOpacity>

        <Text style={styles.statusText}>
          {isListening ? "LISTENING..." : "TAP TO LISTEN"}
        </Text>
        <Text style={styles.helperText}>
          Identify scenes, OSTs, and character voices instantly.
        </Text>

        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons
            name="cloud-upload-outline"
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.uploadText}>Upload Audio File</Text>
        </TouchableOpacity>
      </View>

      {/* Recently Identified */}
      <View style={styles.recentSection}>
        <View style={GlobalStyles.row}>
          <Text style={styles.recentTitle}>RECENTLY IDENTIFIED</Text>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </View>

        <View style={styles.cardsRow}>
          {/* Mock Recent 1 */}
          <View style={styles.recentCard}>
            <View style={styles.imagePlaceholder}>
              {/* Placeholder for Blue Bird Art */}
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>98% MATCH</Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.songTitle}>Blue Bird</Text>
              <Text style={styles.animeTitle}>Naruto Shippuden</Text>
            </View>
          </View>

          {/* Mock Recent 2 */}
          <View style={styles.recentCard}>
            <View style={styles.imagePlaceholder}>
              {/* Placeholder for Tank! Art */}
              <View style={[styles.matchBadge, { backgroundColor: "#A020F0" }]}>
                <Text style={styles.matchText}>OST</Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.songTitle}>Tank!</Text>
              <Text style={styles.animeTitle}>Cowboy Bebop</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 1,
  },
  backButton: {
    padding: 4,
  },
  listeningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
  listenButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 240, 255, 0.05)", // Very faint cyan bg
    marginBottom: 32,
    zIndex: 10,
  },
  ripple: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: Colors.secondary,
    borderWidth: 1,
    top: 104, // Adjust for centering manualy or use absolute centering
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 2,
    marginBottom: 16,
  },
  helperText: {
    color: Colors.textSecondary,
    textAlign: "center",
    maxWidth: "70%",
    marginBottom: 32,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(249, 47, 96, 0.5)",
    backgroundColor: "rgba(249, 47, 96, 0.1)",
  },
  uploadText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  recentSection: {
    padding: 16,
  },
  recentTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  viewAll: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  recentCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: "#333",
    justifyContent: "flex-end",
    padding: 8,
  },
  matchBadge: {
    backgroundColor: Colors.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  cardInfo: {
    padding: 12,
  },
  songTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  animeTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
