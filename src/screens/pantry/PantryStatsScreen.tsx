import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { Screen, Header, Card, ProgressRing } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { PantryItem } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;

function computeHealth(items: PantryItem[]): number {
  if (items.length === 0) return 100;
  const now = Date.now();
  const healthy = items.filter((item) => {
    if (!item.expiresAt) return true;
    return new Date(item.expiresAt).getTime() - now > 3 * DAY_MS;
  });
  return Math.round((healthy.length / items.length) * 100);
}

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
}: {
  category: string;
  count: number;
  max: number;
  color: string;
}) {
  const { colors } = useTheme();
  const width = max === 0 ? 0 : (count / max) * 100;
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: colors.text }]}>{category}</Text>
      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.barFill, { width: `${width}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barCount, { color: colors.textMuted }]}>{count}</Text>
    </View>
  );
}

export function PantryStatsScreen() {
  const { colors } = useTheme();
  const { items } = usePantry();

  const health = useMemo(() => computeHealth(items), [items]);
  const categoryCounts = useMemo(() => groupCounts(items), [items]);
  const maxCount = categoryCounts[0]?.count ?? 0;
  const barPalette = [colors.primary, colors.accent, colors.highlight, colors.secondary];

  const expiredCount = useMemo(
    () =>
      items.filter((item) => item.expiresAt && new Date(item.expiresAt).getTime() < Date.now())
        .length,
    [items]
  );

  const wasteSavingsEstimate = Math.max(0, items.length - expiredCount) * 3.5;

  return (
    <Screen>
      <Header title="Pantry stats" subtitle="How your pantry is trending" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.healthCard}>
          <ProgressRing value={health} label="Health score" />
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
              />
            ))
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Waste savings</Text>
          <Text style={[styles.savingsValue, { color: colors.success }]}>
            ~${wasteSavingsEstimate.toFixed(0)}
          </Text>
          <Text style={[styles.savingsCaption, { color: colors.textMuted }]}>
            Estimated value of food kept out of the trash this month.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  healthCard: {
    alignItems: "center",
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
  },
  barCount: {
    ...typography.caption,
    width: 24,
    textAlign: "right",
  },
  savingsValue: {
    ...typography.display,
  },
  savingsCaption: {
    ...typography.body,
    marginTop: spacing.xs,
  },
});
