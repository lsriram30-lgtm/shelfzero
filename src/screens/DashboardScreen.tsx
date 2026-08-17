import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import { useOnboarding } from "../context/OnboardingContext";
import { useNotificationPreferences } from "../context/NotificationPreferencesContext";
import { usePantry } from "../hooks/usePantry";
import { Card, Header, ProgressRing, Button, Screen, EmptyState, ErrorState, Pill } from "../components";
import { spacing, typography } from "../theme";
import { MainTabParamList } from "../navigation/types";
import { syncExpiryReminders } from "../notifications/expiryNotifications";
import { buildExpiringSoonBriefing, computeHealth, soonToExpire } from "./dashboardLogic";

type DashboardNavigationProp = BottomTabNavigationProp<MainTabParamList, "Dashboard">;

export function DashboardScreen() {
  const { colors } = useTheme();
  const { profile } = useOnboarding();
  const { items, loading, error, isOffline, refresh } = usePantry();
  const { notifyExpiry } = useNotificationPreferences();
  const navigation = useNavigation<DashboardNavigationProp>();

  const health = useMemo(() => computeHealth(items), [items]);
  const expiringSoon = useMemo(() => soonToExpire(items), [items]);

  useEffect(() => {
    syncExpiryReminders(items, notifyExpiry).catch(() => {});
  }, [items, notifyExpiry]);

  const greeting = profile?.name ? `Hi ${profile.name.split(" ")[0]}` : "Welcome back";
  const briefing = buildExpiringSoonBriefing(expiringSoon.length);

  const recommendedMeal = expiringSoon[0];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Header title={greeting} subtitle="Here's your pantry snapshot" />

        {isOffline ? (
          <View style={styles.offlineBanner}>
            <Pill label="Showing last synced data — couldn't reach the server" tone="warning" />
          </View>
        ) : null}

        {loading && items.length === 0 ? (
          <Card style={styles.ringCard}>
            <ActivityIndicator color={colors.primary} />
          </Card>
        ) : error && items.length === 0 ? (
          <Card style={styles.ringCard}>
            <ErrorState onRetry={refresh} />
          </Card>
        ) : items.length === 0 ? (
          <Card style={styles.ringCard}>
            <EmptyState
              icon="basket-outline"
              title="Your pantry is empty"
              message="Add your first item to start tracking freshness and to see your pantry health."
              actionLabel="Add item"
              onAction={() => navigation.navigate("PantryTab", { screen: "AddPantryItem" })}
            />
          </Card>
        ) : (
          <Card style={styles.ringCard}>
            <ProgressRing value={health} label="Pantry health" />
            <Text style={[styles.healthExplanation, { color: colors.textMuted }]}>
              Share of items not expiring within the next 3 days.
            </Text>
            <Text style={[styles.briefing, { color: colors.text }]}>{briefing}</Text>
          </Card>
        )}

        {recommendedMeal ? (
          <Card style={styles.card}>
            <Pill label="USE IT UP" tone="highlight" />
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
              onPress={() => navigation.navigate("MealPlanner", { screen: "MealPlannerHome" })}
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
  offlineBanner: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  ringCard: {
    marginHorizontal: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
  },
  healthExplanation: {
    ...typography.caption,
    textAlign: "center",
  },
  briefing: {
    ...typography.body,
    textAlign: "center",
  },
  card: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  cardTitle: {
    ...typography.h2,
    marginTop: spacing.sm,
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
