import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { usePantry } from "../hooks/usePantry";
import { useShoppingList } from "../hooks/useShoppingList";
import { useOnboarding } from "../context/OnboardingContext";
import { useAuth } from "../context/AuthContext";
import { mealPlanApi } from "../api/mealPlan";
import {
  Screen,
  Header,
  Card,
  CardHeader,
  CardHeaderLink,
  Button,
  EmptyState,
  ErrorState,
  Pill,
} from "../components";
import { spacing, typography } from "../theme";
import { MealIngredient, MealPlanDay } from "../types";
import {
  buildGenerationFailureMessage,
  buildMealPlanPreferences,
  formatIngredientLabel,
  hasEnoughPantryItems,
  hasPantryChanged,
  missingIngredients,
  parseIngredientQuantity,
  parseMealPlanDays,
  replaceDayInPlan,
  WEEKDAY_LABELS,
} from "./mealPlannerLogic";
import { findMatchingUnchecked } from "./household/shoppingListLogic";
import {
  CachedMealPlan,
  getCachedMealPlan,
  saveMealPlanToHistory,
  setCachedMealPlan,
} from "../utils/mealPlanCache";
import { MealPlannerStackParamList } from "../navigation/types";

const NOT_ENOUGH_ITEMS_MESSAGE = "To generate a 7-day meal plan, add more items to your pantry.";

type MealPlannerNavigationProp = NativeStackNavigationProp<
  MealPlannerStackParamList,
  "MealPlannerHome"
>;

export function MealPlannerScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<MealPlannerNavigationProp>();
  const { items: pantryItems } = usePantry();
  const { items: shoppingItems, addItem, updateQuantity } = useShoppingList();
  const { profile } = useOnboarding();
  const { currentEmail } = useAuth();
  const [days, setDays] = useState<MealPlanDay[]>([]);
  const [cachedPantryNames, setCachedPantryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addingMissingKey, setAddingMissingKey] = useState<string | null>(null);
  const [addedMissingKeys, setAddedMissingKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    getCachedMealPlan(currentEmail).then((cached) => {
      if (!cached) return;
      setDays(cached.days);
      setCachedPantryNames(cached.pantryItemNames);
    });
  }, [currentEmail]);

  const currentPantryNames = pantryItems.map((item) => item.name);
  const isStale = days.length > 0 && hasPantryChanged(currentPantryNames, cachedPantryNames);
  const hasEnoughItems = hasEnoughPantryItems(pantryItems.length);

  // A single request for all 7 days/21 meals was too slow (Airo confirmed
  // even their own test timed out) - this makes 7 fast single-day
  // requests instead, one per weekday, and stitches the results together.
  // A day that fails partway through doesn't discard the days that
  // already succeeded; per-day regenerate (below) is how to retry just
  // the missing one(s) afterward.
  const handleGenerate = async () => {
    if (!hasEnoughItems) {
      setError(NOT_ENOUGH_ITEMS_MESSAGE);
      return;
    }
    setLoading(true);
    setError(null);
    const preferences = buildMealPlanPreferences(profile);
    const generatedDays: MealPlanDay[] = [];
    try {
      for (let dayIndex = 0; dayIndex < WEEKDAY_LABELS.length; dayIndex++) {
        setGenerationProgress({ current: dayIndex + 1, total: WEEKDAY_LABELS.length });
        const raw = await mealPlanApi.generate({
          pantryItems: currentPantryNames,
          preferences,
          days: 1,
          dayIndex,
        });
        const parsedDays = parseMealPlanDays(raw);
        if (parsedDays[0]) generatedDays.push(parsedDays[0]);
      }
      setDays(generatedDays);
      setCachedPantryNames(currentPantryNames);
      const toCache = { days: generatedDays, pantryItemNames: currentPantryNames };
      setCachedMealPlan(toCache, currentEmail);
      // Only a genuinely complete week (the loop above ran with no
      // exception - a partial failure jumps to catch instead) is worth
      // its own history entry.
      saveMealPlanToHistory(toCache, currentEmail);
    } catch (err) {
      if (generatedDays.length > 0) setDays(generatedDays);
      setError(
        buildGenerationFailureMessage(
          generatedDays.length,
          WEEKDAY_LABELS.length,
          err instanceof Error ? err.message : "Couldn't generate a meal plan."
        )
      );
    } finally {
      setLoading(false);
      setGenerationProgress(null);
    }
  };

  const handleRegenerateDay = async (dayLabel: string) => {
    if (loading || regeneratingDay) return;
    if (!hasEnoughItems) {
      setError(NOT_ENOUGH_ITEMS_MESSAGE);
      return;
    }
    setRegeneratingDay(dayLabel);
    setError(null);
    try {
      const raw = await mealPlanApi.generate({
        pantryItems: currentPantryNames,
        preferences: buildMealPlanPreferences(profile),
        days: 1,
        startDay: dayLabel,
      });
      const updatedDays = replaceDayInPlan(days, dayLabel, parseMealPlanDays(raw));
      setDays(updatedDays);
      // Deliberately NOT updating cachedPantryNames here: only this one day
      // was actually regenerated against the current pantry, so the other
      // six are still whatever they were before. Marking the whole week as
      // "matches current pantry" would incorrectly hide the "pantry
      // changed" banner even though most of the week is still stale.
      setCachedMealPlan({ days: updatedDays, pantryItemNames: cachedPantryNames }, currentEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Couldn't regenerate ${dayLabel}.`);
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleKeepPlan = () => {
    setCachedPantryNames(currentPantryNames);
    const toCache: CachedMealPlan = { days, pantryItemNames: currentPantryNames };
    setCachedMealPlan(toCache, currentEmail);
  };

  const handleAddMissingIngredients = async (key: string, missing: MealIngredient[]) => {
    if (addingMissingKey) return;
    setAddingMissingKey(key);
    try {
      // Local running view of the shopping list, updated as we go - the
      // `shoppingItems` closure won't reflect an item this same loop just
      // added/bumped until the next render, so two same-named ingredients
      // in one meal's missing list (e.g. "Garlic" twice) would otherwise
      // both miss the existing-item check and create duplicate rows.
      let localItems = shoppingItems;
      for (const ingredient of missing) {
        const qty = parseIngredientQuantity(ingredient.quantity);
        const existing = findMatchingUnchecked(localItems, ingredient.name);
        if (existing) {
          const updatedQty = existing.qty + qty;
          await updateQuantity(existing.id, updatedQty);
          localItems = localItems.map((item) =>
            item.id === existing.id ? { ...item, qty: updatedQty } : item
          );
        } else {
          const created = await addItem({ name: ingredient.name, qty });
          localItems = [created, ...localItems];
        }
      }
      setAddedMissingKeys((prev) => new Set(prev).add(key));
    } catch (err) {
      Alert.alert(
        "Couldn't add items",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setAddingMissingKey(null);
    }
  };

  return (
    <Screen>
      <Header
        title="Meal planner"
        subtitle="A 7-day plan built from your pantry"
        right={
          <Pressable
            onPress={() => navigation.navigate("MealPlanHistory")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View meal plan history"
          >
            <Ionicons name="time-outline" size={22} color={colors.primary} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Button
          label={loading ? "Generating…" : days.length > 0 ? "Regenerate plan" : "Generate 7-day plan"}
          onPress={handleGenerate}
          loading={loading}
          disabled={!!regeneratingDay}
          style={styles.generateButton}
        />
        {generationProgress ? (
          <Text style={[styles.generationProgressText, { color: colors.textMuted }]}>
            Generating day {generationProgress.current} of {generationProgress.total}…
          </Text>
        ) : null}

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
              <CardHeader
                title={day.day}
                action={
                  <CardHeaderLink
                    label={regeneratingDay === day.day ? "Regenerating…" : "Regenerate"}
                    onPress={() => handleRegenerateDay(day.day)}
                    disabled={loading || !!regeneratingDay}
                  />
                }
              />
              {day.meals.map((meal, index) => {
                const missing = missingIngredients(meal.ingredients);
                const key = `${day.day}-${meal.title}`;
                const added = addedMissingKeys.has(key);
                const adding = addingMissingKey === key;
                return (
                  <View key={index} style={styles.mealRow}>
                    <Text style={[styles.mealLabel, { color: colors.textMuted }]}>
                      {meal.label}
                    </Text>
                    <Text style={[styles.mealTitle, { color: colors.text }]}>{meal.title}</Text>
                    {meal.description ? (
                      <Text style={[styles.mealDescription, { color: colors.textMuted }]}>
                        {meal.description}
                      </Text>
                    ) : null}
                    {missing.length > 0 ? (
                      <View style={styles.missingWrapper}>
                        <Text style={[styles.missingText, { color: colors.textMuted }]}>
                          Missing: {missing.map(formatIngredientLabel).join(", ")}
                        </Text>
                        <CardHeaderLink
                          label={
                            added
                              ? "Added to shopping list"
                              : adding
                                ? "Adding…"
                                : "Add missing to shopping list"
                          }
                          onPress={() => handleAddMissingIngredients(key, missing)}
                          disabled={added || adding}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              })}
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
  generationProgressText: {
    ...typography.caption,
    textAlign: "center",
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
  missingWrapper: {
    marginTop: spacing.sm,
  },
  missingText: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
});
