import AsyncStorage from "@react-native-async-storage/async-storage";
import { TraceMoeResult } from "../types/trace";

const HISTORY_KEY = "@anifind_history_v1";

export const HistoryService = {
  // Save a new scan result to history
  saveScan: async (item: TraceMoeResult) => {
    try {
      const currentHistory = await HistoryService.getHistory();

      // Avoid duplicates (check by image URL or filename+timestamp)
      const exists = currentHistory.some((h) => h.image === item.image); // Simplified check
      if (exists) return;

      const newHistory = [item, ...currentHistory];
      // Limit to 50 items
      if (newHistory.length > 50) newHistory.pop();

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  },

  // Get all history items
  getHistory: async (): Promise<TraceMoeResult[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Failed to read history", e);
      return [];
    }
  },

  // Clear all history
  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  },
};
