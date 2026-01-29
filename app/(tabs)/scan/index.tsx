import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import { Colors } from "../../../constants/Colors";
import { GlobalStyles } from "../../../constants/Styles";
import { TraceMoeService } from "../../../services/trace";

export default function ScanScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const videoRef = useRef<Video>(null);
  const videoViewRef = useRef(null); // For capturing the video frame
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"image" | "video">("image");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-trigger video picker if mode=video
  useEffect(() => {
    if (searchParams.mode === "video") {
      pickVideo();
    }
  }, [searchParams.mode]);

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Camera access is needed to scan.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false, // We'll show our own crop UI equivalent
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);

        // Show guidance alert
        Alert.alert(
          "📸 Best Results Tip",
          "For accurate identification, use screenshots directly from anime episodes. Character art, fan art, or manga panels won't work well.",
          [{ text: "Got it!", style: "default" }],
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickVideo = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Media library access is needed to select videos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedVideo(result.assets[0].uri);
        setSearchMode("video");

        // Show guidance alert
        Alert.alert(
          "🎬 Video Scene Search",
          "The app will analyze frames from your video to identify the anime. This may take a moment.",
          [{ text: "Got it!", style: "default" }],
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const results = await TraceMoeService.searchByImage(selectedImage);
      if (results.length > 0) {
        // Pass results via params (serializing as JSON string due to limits)
        // @ts-ignore
        router.push({
          // @ts-ignore
          pathname: "/(tabs)/scan/results",
          params: { results: JSON.stringify(results), imageUri: selectedImage },
        });
        // Reset after navigation so back takes you to clean state? Or keep it?
        // setSelectedImage(null);
      } else {
        Alert.alert("No results", "No anime found for this image.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search image");
    } finally {
      setLoading(false);
    }
  };

  if (selectedImage) {
    // CROP IMAGE UI STATE (Full Screen)
    return (
      <SafeAreaView style={GlobalStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Crop Image</Text>
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="close-circle" size={20} color={Colors.primary} />
              <Text style={[styles.resetText, { color: Colors.primary }]}>
                CLEAR
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cropContainer}>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              Crop out subtitles for better accuracy
            </Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.mainImage}
              contentFit="contain"
            />
            {/* Grid Overlay */}
            <View style={styles.gridOverlay}>
              <View style={styles.gridRow} />
              <View style={styles.gridRow} />
            </View>
            <View style={styles.gridOverlayVertical}>
              <View style={styles.gridCol} />
              <View style={styles.gridCol} />
            </View>
            {/* Corner Brackets */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
        </View>

        {/* Identify FAB Button */}
        <TouchableOpacity
          style={styles.identifyButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons
                name="search"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.identifyText}>IDENTIFY SCENE</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // VIDEO PREVIEW UI STATE (Full Screen)
  if (selectedVideo) {
    return (
      <SafeAreaView style={GlobalStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectedVideo(null);
              setSearchMode("image");
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Video Scene</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedVideo(null);
              setSearchMode("image");
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="close-circle" size={20} color={Colors.primary} />
              <Text style={[styles.resetText, { color: Colors.primary }]}>
                CLEAR
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              Pause the video at the scene you want to identify
            </Text>
          </View>

          <View style={styles.videoWrapper} ref={videoViewRef}>
            <Video
              ref={videoRef}
              source={{ uri: selectedVideo }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setIsVideoPlaying(status.isPlaying);
                }
              }}
            />

            {/* Play/Pause Overlay */}
            {!isVideoPlaying && (
              <TouchableOpacity
                style={styles.playOverlay}
                onPress={() => videoRef.current?.playAsync()}
              >
                <View style={styles.playButton}>
                  <Ionicons name="play" size={48} color="#FFF" />
                </View>
              </TouchableOpacity>
            )}

            {/* Pause button when playing */}
            {isVideoPlaying && (
              <TouchableOpacity
                style={styles.pauseOverlay}
                onPress={() => videoRef.current?.pauseAsync()}
              >
                <View style={styles.pauseButton}>
                  <Ionicons name="pause" size={32} color="#FFF" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Capture & Search Button */}
        <TouchableOpacity
          style={styles.identifyButton}
          onPress={async () => {
            if (!videoViewRef.current) {
              Alert.alert("Error", "Video not ready");
              return;
            }

            setLoading(true);
            try {
              // Pause video first to ensure we capture the current frame
              await videoRef.current?.pauseAsync();

              // Capture the video view as an image
              const uri = await captureRef(videoViewRef, {
                format: "jpg",
                quality: 0.8,
              });

              // Search the captured frame
              const results = await TraceMoeService.searchByImage(uri);
              if (results.length > 0) {
                // Clear video and navigate to results
                setSelectedVideo(null);
                setSearchMode("image");

                // @ts-ignore
                router.push({
                  // @ts-ignore
                  pathname: "/(tabs)/scan/results",
                  params: { results: JSON.stringify(results), imageUri: uri },
                });
              } else {
                Alert.alert("No results", "No anime found for this frame.");
              }
            } catch (error) {
              console.error("Frame capture error:", error);
              Alert.alert("Error", "Failed to capture and search frame");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons
                name="camera"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.identifyText}>CAPTURE & SEARCH</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // DEFAULT START STATE
  return (
    <SafeAreaView style={[GlobalStyles.container, styles.center]}>
      <View style={styles.startHeader}>
        <Ionicons
          name="scan-circle-outline"
          size={80}
          color={Colors.secondary}
        />
        <Text style={styles.startTitle}>Visual Scan</Text>
      </View>

      <View style={styles.startContent}>
        <TouchableOpacity
          style={[styles.optionCard, { borderColor: Colors.secondary }]}
          onPress={() => pickImage(true)}
        >
          <Ionicons name="camera" size={32} color={Colors.secondary} />
          <Text style={[styles.optionTitle, { color: Colors.secondary }]}>
            Camera
          </Text>
          <Text style={styles.optionSubtitle}>Capture scene directly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, { borderColor: Colors.primary }]}
          onPress={() => pickImage(false)}
        >
          <Ionicons name="images" size={32} color={Colors.primary} />
          <Text style={[styles.optionTitle, { color: Colors.primary }]}>
            Gallery
          </Text>
          <Text style={styles.optionSubtitle}>Upload screenshot</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 4,
  },
  resetText: {
    color: Colors.secondary,
    fontWeight: "bold",
    fontSize: 14,
  },
  cropContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  tipContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 3 / 4, // Portrait-ish crop area
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingVertical: "33.33%",
  },
  gridRow: {
    height: 1,
    backgroundColor: "rgba(0, 240, 255, 0.3)", // Faint cyan
    width: "100%",
  },
  gridOverlayVertical: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "33.33%",
  },
  gridCol: {
    width: 1,
    backgroundColor: "rgba(0, 240, 255, 0.3)",
    height: "100%",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: Colors.secondary,
    borderWidth: 3,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  tool: {
    alignItems: "center",
    gap: 8,
    opacity: 0.6,
  },
  toolText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  identifyButton: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 24,
    height: 60,
    borderRadius: 30,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  identifyText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Start Screen Styles
  startHeader: {
    alignItems: "center",
    marginBottom: 48,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 16,
  },
  startContent: {
    width: "100%",
    gap: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center", // Row layout for cards? Or stack?
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  // Video Player Styles
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(249,47,96,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  pauseOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
