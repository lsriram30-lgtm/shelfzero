import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { Screen, Header, Card, ProgressRing } from "../../components";
import { spacing, typography, radius, readableTextColor } from "../../theme";
import { PantryItem } from "../../types";
import { PantryStackParamList } from "../../navigation/types";
import { computeHealth } from "../dashboardLogic";

type PantryStatsNavigationProp = NativeStackNavigationProp<PantryStackParamList, "PantryStats">;

const DAY_MS = 24 * 60 * 60 * 1000;

function groupCounts(items: PantryItem[]): { category: string; count: number }[] {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const key = item.category || "Uncategorized";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function CategoryBar({
  category,
  count,
  max,
  color,
  onPress,
}: {
  category: string;
  count: number;
  max: number;
  color: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const width = max === 0 ? 0 : (count / max) * 100;
  return (
    <Pressable
      style={styles.barRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${category} items in Pantry`}
    >
      <Text style={[styles.barLabel, { color: colors.text }]}>{category}</Text>
      <View style={[styles.barTrack, { backgroundColor: colors.statBarTrack }]}>
        <View
          style={[
            styles.barFill,
            { width: `${width}%`, backgroundColor: color, borderColor: readableTextColor(color) },
          ]}
        />
      </View>
      <Text style={[styles.barCount, { color: colors.textMuted }]}>{count}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
    </Pressable>
  );
}

export function PantryStatsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<PantryStatsNavigationProp>();
  const { items, loading } = usePantry();

  const health = useMemo(() => computeHealth(items), [items]);
  const categoryCounts = useMemo(() => groupCounts(items), [items]);
  const maxCount = categoryCounts[0]?.count ?? 0;
  const barPalette = [colors.primary, colors.accent, colors.highlight, colors.secondary];

  const draggingDownCount = useMemo(() => {
    const now = Date.now();
    return items.filter(
      (item) => item.expiresAt && new Date(item.expiresAt).getTime() - now <= 3 * DAY_MS
    ).length;
  }, [items]);

  return (
    <Screen>
      <Header title="Pantry stats" subtitle="How your pantry is trending" />
      {loading && items.length === 0 ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.healthCard}>
            <ProgressRing value={health} label="Health score" />
            <Text style={[styles.healthExplanation, { color: colors.textMuted }]}>
              Share of items not expiring within the next 3 days
              {health < 70 && draggingDownCount > 0
                ? ` — ${draggingDownCount} item${draggingDownCount === 1 ? "" : "s"} close to ` +
                  `expiring ${draggingDownCount === 1 ? "is" : "are"} dragging it down. Sort the ` +
                  `pantry by expiry date to see which.`
                : "."}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>By category</Text>
            {categoryCounts.length === 0 ? (
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                Add pantry items to see a breakdown.
              </Text>
            ) : (
              categoryCounts.map(({ category, count }, index) => (
                <CategoryBar
                  key={category}
                  category={category}
                  count={count}
                  max={maxCount}
                  color={barPalette[index % barPalette.length]}
                  onPress={() => navigation.navigate("Pantry", { category })}
                />
              ))
            )}
          </Card>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  healthCard: {
    alignItems: "center",
    gap: spacing.sm,
  },
  healthExplanation: {
    ...typography.caption,
    textAlign: "center",
  },
  card: {},
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  empty: {
    ...typography.body,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  barLabel: {
    ...typography.caption,
    width: 90,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  barCount: {
    ...typography.caption,
    width: 24,
    textAlign: "right",
  },
});
