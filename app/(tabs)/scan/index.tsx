import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/Colors";
import { GlobalStyles } from "../../../constants/Styles";
import { TraceMoeService } from "../../../services/trace";

export default function ScanScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
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
    // CROP IMAGE UI STATE
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
          <TouchableOpacity>
            <Text style={styles.resetText}>RESET</Text>
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
            {/* Fake Grid Overlay */}
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

        {/* Tools */}
        <View style={styles.toolsRow}>
          <View style={styles.tool}>
            <Ionicons name="refresh" size={24} color={Colors.textSecondary} />
            <Text style={styles.toolText}>ROTATE</Text>
          </View>
          <View style={styles.tool}>
            <Ionicons name="resize" size={24} color={Colors.textSecondary} />
            <Text style={styles.toolText}>RATIO</Text>
          </View>
          <View style={styles.tool}>
            <Ionicons
              name="swap-horizontal"
              size={24}
              color={Colors.textSecondary}
            />
            <Text style={styles.toolText}>FLIP</Text>
          </View>
        </View>

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
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
});
