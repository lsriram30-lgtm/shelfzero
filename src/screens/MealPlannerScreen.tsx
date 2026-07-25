import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { usePantry } from "../hooks/usePantry";
import { mealPlanApi } from "../api/mealPlan";
import { Screen, Header, Card, Button, EmptyState, ErrorState } from "../components";
import { spacing, typography } from "../theme";
import { MealPlanDay } from "../types";

const CACHE_KEY = "shelfzero.mealPlan";

export function MealPlannerScreen() {
  const { colors } = useTheme();
  const { items: pantryItems } = usePantry();
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY)
      .then((cached) => {
        if (cached) setDays(JSON.parse(cached) as MealPlanDay[]);
      })
      .catch(() => {
        // No usable cache — the screen just starts from the empty state.
      });
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await mealPlanApi.generate({
        pantryItems: pantryItems.map((item) => item.name),
      });
      setDays(plan.days);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(plan.days)).catch(() => {});
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
