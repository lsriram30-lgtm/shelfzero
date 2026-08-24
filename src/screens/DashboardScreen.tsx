import React, { useEffect, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import { useOnboarding } from "../context/OnboardingContext";
import { useNotificationPreferences } from "../context/NotificationPreferencesContext";
import { usePantry } from "../hooks/usePantry";
import {
  Card,
  Header,
  ProgressRing,
  Button,
  Screen,
  EmptyState,
  ErrorState,
  Pill,
  Skeleton,
} from "../components";
import { spacing, typography } from "../theme";
import { MainTabParamList } from "../navigation/types";
import { syncExpiryReminders } from "../notifications/expiryNotifications";
import { buildExpiringSoonBriefing, computeHealth, soonToExpire } from "./dashboardLogic";
import { daysUntil, formatExpiryLabel } from "./pantry/pantryLogic";

const MAX_EXPIRING_SHOWN = 3;

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

  const visibleExpiring = expiringSoon.slice(0, MAX_EXPIRING_SHOWN);
  const remainingExpiringCount = expiringSoon.length - visibleExpiring.length;

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
            <Skeleton width={140} height={140} radius={70} />
            <Skeleton width={200} height={12} />
            <Skeleton width={160} height={16} />
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

        {visibleExpiring.length > 0 ? (
          <Card style={styles.card}>
            <Pill label="USE IT UP" tone="highlight" />
            {visibleExpiring.map((item) => (
              <View key={item.id} style={styles.expiringRow}>
                <Text style={[styles.expiringName, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.expiringDays, { color: colors.textMuted }]}>
                  {formatExpiryLabel(daysUntil(item.expiresAt) ?? 0)}
                </Text>
              </View>
            ))}
            {remainingExpiringCount > 0 ? (
              <Text style={[styles.cardBody, { color: colors.textMuted }]}>
                +{remainingExpiringCount} more expiring soon
              </Text>
            ) : null}
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
  expiringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  expiringName: {
    ...typography.bodyMedium,
    flexShrink: 1,
  },
  expiringDays: {
    ...typography.caption,
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
