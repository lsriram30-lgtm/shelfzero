import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { usePantry } from "../hooks/usePantry";
import { useOnboarding } from "../context/OnboardingContext";
import { mealPlanApi } from "../api/mealPlan";
import { Screen, Header, Card, Button, EmptyState, ErrorState, Pill } from "../components";
import { spacing, typography } from "../theme";
import { MealPlanDay } from "../types";
import { buildMealPlanPreferences, hasEnoughPantryItems, hasPantryChanged } from "./mealPlannerLogic";
import { CachedMealPlan, getCachedMealPlan, setCachedMealPlan } from "../utils/mealPlanCache";

const NOT_ENOUGH_ITEMS_MESSAGE = "To generate a 7-day meal plan, add more items to your pantry.";

export function MealPlannerScreen() {
  const { colors } = useTheme();
  const { items: pantryItems } = usePantry();
  const { profile } = useOnboarding();
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [cachedPantryNames, setCachedPantryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCachedMealPlan().then((cached) => {
      if (!cached) return;
      setDays(cached.days);
      setCachedPantryNames(cached.pantryItemNames);
    });
  }, []);

  const currentPantryNames = pantryItems.map((item) => item.name);
  const isStale = days.length > 0 && hasPantryChanged(currentPantryNames, cachedPantryNames);
  const hasEnoughItems = hasEnoughPantryItems(pantryItems.length);

  const handleGenerate = async () => {
    if (!hasEnoughItems) {
      setError(NOT_ENOUGH_ITEMS_MESSAGE);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const plan = await mealPlanApi.generate({
        pantryItems: currentPantryNames,
        preferences: buildMealPlanPreferences(profile),
      });
      setDays(plan.days);
      setCachedPantryNames(currentPantryNames);
      const toCache: CachedMealPlan = { days: plan.days, pantryItemNames: currentPantryNames };
      setCachedMealPlan(toCache);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't generate a meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeepPlan = () => {
    setCachedPantryNames(currentPantryNames);
    const toCache: CachedMealPlan = { days, pantryItemNames: currentPantryNames };
    setCachedMealPlan(toCache);
  };

  return (
    <Screen>
      <Header title="Meal planner" subtitle="A 7-day plan built from your pantry" />
      <ScrollView contentContainerStyle={styles.content}>
        <Button
          label={loading ? "Generating…" : days.length > 0 ? "Regenerate plan" : "Generate 7-day plan"}
          onPress={handleGenerate}
          loading={loading}
          style={styles.generateButton}
        />

        {isStale && !loading ? (
          <Card style={styles.staleBanner}>
            <View style={styles.staleHeader}>
              <Pill label="Pantry changed" tone="warning" />
            </View>
            <Text style={[styles.staleText, { color: colors.text }]}>
              Your pantry's changed since this plan was made — some suggestions may no longer fit.
            </Text>
            <View style={styles.staleActions}>
              <Button
                label="Regenerate now"
                onPress={handleGenerate}
                style={styles.staleButton}
              />
              <Button
                label="Leave as is"
                variant="outline"
                onPress={handleKeepPlan}
                style={styles.staleButton}
              />
            </View>
          </Card>
        ) : null}

        {error ? (
          <ErrorState message={error} onRetry={handleGenerate} />
        ) : days.length === 0 && !loading && !hasEnoughItems ? (
          <EmptyState
            icon="basket-outline"
            title="Not enough pantry items"
            message={NOT_ENOUGH_ITEMS_MESSAGE}
          />
        ) : days.length === 0 && !loading ? (
          <EmptyState
            icon="calendar-outline"
            title="No plan yet"
            message="Generate a plan and we'll suggest meals based on what's in your pantry."
          />
        ) : (
          days.map((day) => (
            <Card key={day.day} style={styles.dayCard}>
              <Text style={[styles.dayTitle, { color: colors.text }]}>{day.day}</Text>
              {day.meals.map((meal, index) => (
                <View key={index} style={styles.mealRow}>
                  <Text style={[styles.mealLabel, { color: colors.textMuted }]}>{meal.label}</Text>
                  <Text style={[styles.mealTitle, { color: colors.text }]}>{meal.title}</Text>
                  {meal.description ? (
                    <Text style={[styles.mealDescription, { color: colors.textMuted }]}>
                      {meal.description}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  generateButton: {
    marginBottom: spacing.lg,
  },
  staleBanner: {
    marginBottom: spacing.lg,
  },
  staleHeader: {
    marginBottom: spacing.sm,
  },
  staleText: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  staleActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  staleButton: {
    flex: 1,
  },
  error: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  dayCard: {
    marginBottom: spacing.md,
  },
  dayTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  mealRow: {
    marginBottom: spacing.md,
  },
  mealLabel: {
    ...typography.label,
  },
  mealTitle: {
    ...typography.bodyMedium,
    marginTop: spacing.xs / 2,
  },
  mealDescription: {
    ...typography.caption,
    marginTop: spacing.xs / 2,
  },
});
