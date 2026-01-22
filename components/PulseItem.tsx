import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

interface PulseItemProps {
  rank: string;
  title: string;
  subtitle: string;
  bars: number[]; // e.g. [0.4, 0.8, 0.6, 1.0] height ratios
}

export function PulseItem({ rank, title, subtitle, bars }: PulseItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rank}>{rank}</Text>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.equalizer}>
        {bars.map((barHeight, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: 24 * barHeight,
                backgroundColor:
                  index === bars.length - 1 ? Colors.secondary : Colors.primary,
                opacity: 0.6 + barHeight * 0.4,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rank: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary, // Let's try Cyan for the numbers like in 02
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  equalizer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 24,
    gap: 4,
  },
  bar: {
    width: 6,
    borderRadius: 2,
  },
});
