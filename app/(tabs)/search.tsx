import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimeCard } from "../../components/AnimeCard";
import { Colors } from "../../constants/Colors";
import { GlobalStyles } from "../../constants/Styles";
import { AniListService } from "../../services/api";
import { Anime } from "../../types/anime";

// Simple debounce implementation
function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchAnime = async (searchText: string) => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await AniListService.searchAnime(searchText);
      setResults(response);
    } catch (err) {
      setError("Failed to search anime");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text: string) => searchAnime(text), 500),
    [],
  );

  const handleTextChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <SafeAreaView style={GlobalStyles.container} edges={["top"]}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search Anime..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleTextChange}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textSecondary}
              onPress={() => handleTextChange("")}
            />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.tint} />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <AnimeCard anime={item} width={170} height={240} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            !loading && query.length > 0 ? (
              <View style={styles.centerContainer}>
                <Text style={GlobalStyles.subtitle}>No results found</Text>
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <Text style={GlobalStyles.subtitle}>
                  Search for your favorite anime
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: Colors.text,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridItem: {
    // width: '48%', // Handled in render logic for layout
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
