import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { usePantry } from "../hooks/usePantry";
import { useOnboarding } from "../context/OnboardingContext";
import { mealPlanApi } from "../api/mealPlan";
import { Screen, Header, Card, Button, EmptyState, ErrorState, Pill } from "../components";
import { spacing, typography } from "../theme";
import { MealPlanDay } from "../types";
import { buildMealPlanPreferences, hasPantryChanged } from "./mealPlannerLogic";

const CACHE_KEY = "shelfzero.mealPlan";

interface CachedMealPlan {
  days: MealPlanDay[];
  pantryItemNames: string[];
}

export function MealPlannerScreen() {
  const { colors } = useTheme();
  const { items: pantryItems } = usePantry();
  const { profile } = useOnboarding();
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [cachedPantryNames, setCachedPantryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY)
      .then((cached) => {
        if (!cached) return;
        const parsed = JSON.parse(cached) as CachedMealPlan;
        setDays(parsed.days);
        setCachedPantryNames(parsed.pantryItemNames);
      })
      .catch(() => {
        // No usable cache — the screen just starts from the empty state.
      });
  }, []);

  const currentPantryNames = pantryItems.map((item) => item.name);
  const isStale = days.length > 0 && hasPantryChanged(currentPantryNames, cachedPantryNames);

  const handleGenerate = async () => {
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
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(toCache)).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't generate a meal plan.");
    } finally {
      setLoading(false);
    }
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
          <View style={styles.staleBanner}>
            <Pill
              label="Your pantry has changed since this plan was made — regenerate for updated suggestions"
              tone="warning"
            />
          </View>
        ) : null}

        {error ? (
          <ErrorState message={error} onRetry={handleGenerate} />
        ) : days.length === 0 && !loading ? (
          <EmptyState
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
