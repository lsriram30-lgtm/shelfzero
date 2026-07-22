import React, { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import { useOnboarding } from "../context/OnboardingContext";
import { usePantry } from "../hooks/usePantry";
import { Card, Header, ProgressRing, Button, Screen, EmptyState } from "../components";
import { spacing, typography } from "../theme";
import { MainTabParamList } from "../navigation/types";
import { PantryItem } from "../types";

type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, "Dashboard">;

const DAY_MS = 24 * 60 * 60 * 1000;

function computeHealth(items: PantryItem[]): number {
  if (items.length === 0) return 100;
  const now = Date.now();
  const healthy = items.filter((item) => {
    if (!item.expiresAt) return true;
    const expires = new Date(item.expiresAt).getTime();
    return expires - now > 3 * DAY_MS;
  });
  return Math.round((healthy.length / items.length) * 100);
}

function soonToExpire(items: PantryItem[]): PantryItem[] {
  const now = Date.now();
  return items
    .filter((item) => item.expiresAt && new Date(item.expiresAt).getTime() - now <= 3 * DAY_MS)
    .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
}

export function DashboardScreen() {
  const { colors } = useTheme();
  const { profile } = useOnboarding();
  const { items, loading, refresh } = usePantry();
  const navigation = useNavigation<DashboardNavigationProp>();

  const health = useMemo(() => computeHealth(items), [items]);
  const expiringSoon = useMemo(() => soonToExpire(items), [items]);

  const greeting = profile?.name ? `Hi ${profile.name.split(" ")[0]}` : "Welcome back";
  const briefing =
    expiringSoon.length > 0
      ? `${expiringSoon.length} item${expiringSoon.length === 1 ? "" : "s"} expiring soon — use them up before they go to waste.`
      : "Your pantry is in great shape today. Nothing is close to expiring.";

  const recommendedMeal = expiringSoon[0];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Header title={greeting} subtitle="Here's your pantry snapshot" />

        {items.length === 0 && !loading ? (
          <Card style={styles.ringCard}>
            <EmptyState
              title="Your pantry is empty"
              message="Add your first item to start tracking freshness and to see your pantry health."
              actionLabel="Add item"
              onAction={() => navigation.navigate("PantryTab", { screen: "AddPantryItem" })}
            />
          </Card>
        ) : (
          <Card style={styles.ringCard}>
            <ProgressRing value={health} label="Pantry health" />
            <Text style={[styles.briefing, { color: colors.text }]}>{briefing}</Text>
          </Card>
        )}

        {recommendedMeal ? (
          <Card style={styles.card}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>USE IT UP</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{recommendedMeal.name}</Text>
            <Text style={[styles.cardBody, { color: colors.textMuted }]}>
              Expires {new Date(recommendedMeal.expiresAt!).toLocaleDateString()} — check Recipes
              for ways to use it.
            </Text>
            <Button
              label="Find a recipe"
              variant="outline"
              onPress={() => navigation.navigate("RecipesTab", { screen: "Recipes" })}
              style={styles.cardAction}
            />
          </Card>
        ) : null}

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick actions</Text>
          <View style={styles.actionRow}>
            <Button
              label="Add item"
              onPress={() => navigation.navigate("PantryTab", { screen: "AddPantryItem" })}
              style={styles.actionButton}
            />
            <Button
              label="Scan"
              variant="secondary"
              onPress={() => navigation.navigate("PantryTab", { screen: "Scan" })}
              style={styles.actionButton}
            />
          </View>
          <View style={styles.actionRow}>
            <Button
              label="Meal plan"
              variant="outline"
              onPress={() => navigation.navigate("MealPlanner")}
              style={styles.actionButton}
            />
            <Button
              label="Household"
              variant="outline"
              onPress={() => navigation.navigate("HouseholdTab", { screen: "HouseholdHub" })}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
  },
  ringCard: {
    marginHorizontal: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
  },
  briefing: {
    ...typography.body,
    textAlign: "center",
  },
  card: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  cardLabel: {
    ...typography.label,
  },
  cardTitle: {
    ...typography.h2,
    marginTop: spacing.xs,
  },
  cardBody: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  cardAction: {
    marginTop: spacing.lg,
    alignSelf: "flex-start",
  },
  quickActions: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
