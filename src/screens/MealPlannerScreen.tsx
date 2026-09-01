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
  buildMealPlanPreferences,
  formatIngredientLabel,
  hasEnoughPantryItems,
  hasPantryChanged,
  missingIngredients,
  nextWeekdayIndex,
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
import { retryOnce } from "../utils/retryOnce";
import { MealPlannerStackParamList } from "../navigation/types";

const NOT_ENOUGH_ITEMS_MESSAGE = "To generate a meal plan, add more items to your pantry.";

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
  const nextDayIndex = nextWeekdayIndex(days);
  const nextDayLabel = nextDayIndex !== null ? WEEKDAY_LABELS[nextDayIndex] : null;

  // A single request for all 7 days/21 meals was too slow, and even 7
  // sequential single-day requests turned out to trip the backend's rate
  // limit when fired back-to-back (confirmed live 8/31: two separate runs
  // of 7 got 429 "temporarily busy" on most/all of them, while isolated
  // single calls made well apart from each other succeeded cleanly). So
  // the week is built up one day at a time instead - starting from today
  // and wrapping forward - only ever making a new request when the user
  // actually asks for the next day, never a burst of several.
  //
  // mealLabel scoping (one meal per call instead of one day per call) was
  // tried and reverted first - live-tested 8/31: an invalid mealLabel
  // value ("brunch") still returned a full, real 3-meal day, so the
  // backend isn't reading or validating that field at all.
  const generateDayInto = async (baseDays: MealPlanDay[], dayIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const raw = await retryOnce(() =>
        mealPlanApi.generate({
          pantryItems: currentPantryNames,
          preferences: buildMealPlanPreferences(profile),
          days: 1,
          dayIndex,
        })
      );
      const parsedDays = parseMealPlanDays(raw);
      if (!parsedDays[0]) {
        setError("Couldn't generate a meal plan. Please try again.");
        return;
      }
      const updatedDays = [...baseDays, parsedDays[0]];
      setDays(updatedDays);
      // Only the first day of a fresh plan resets the pantry snapshot -
      // same reasoning as handleRegenerateDay below: days added one at a
      // time afterward shouldn't change what "matches current pantry"
      // means for the days already built.
      const pantryNamesForCache = baseDays.length === 0 ? currentPantryNames : cachedPantryNames;
      if (baseDays.length === 0) setCachedPantryNames(currentPantryNames);
      const toCache = { days: updatedDays, pantryItemNames: pantryNamesForCache };
      setCachedMealPlan(toCache, currentEmail);
      // Only once the full week is actually built up is it worth its own
      // history entry.
      if (updatedDays.length === WEEKDAY_LABELS.length) {
        saveMealPlanToHistory(toCache, currentEmail);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't generate a meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNextDay = () => {
    if (!hasEnoughItems) {
      setError(NOT_ENOUGH_ITEMS_MESSAGE);
      return;
    }
    if (nextDayIndex === null) return;
    generateDayInto(days, nextDayIndex);
  };

  const handleRegenerateFromStale = () => {
    if (!hasEnoughItems) {
      setError(NOT_ENOUGH_ITEMS_MESSAGE);
      return;
    }
    const freshDayIndex = nextWeekdayIndex([]);
    if (freshDayIndex === null) return;
    setDays([]);
    generateDayInto([], freshDayIndex);
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
      const raw = await retryOnce(() =>
        mealPlanApi.generate({
          pantryItems: currentPantryNames,
          preferences: buildMealPlanPreferences(profile),
          days: 1,
          startDay: dayLabel,
        })
      );
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
        subtitle="A meal plan built day by day from your pantry"
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
        {days.length === 0 ? (
          <Button
            label={loading ? "Generating…" : `Generate ${nextDayLabel}'s meal plan`}
            onPress={handleGenerateNextDay}
            loading={loading}
            style={styles.generateButton}
          />
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
                onPress={handleRegenerateFromStale}
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
          <ErrorState message={error} onRetry={handleGenerateNextDay} />
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

        {!error && days.length > 0 && nextDayLabel ? (
          <Button
            label={loading ? "Adding…" : `+ Add ${nextDayLabel}'s plan`}
            variant="outline"
            onPress={handleGenerateNextDay}
            loading={loading}
            disabled={!!regeneratingDay}
            style={styles.addDayButton}
          />
        ) : null}
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
  addDayButton: {
    marginTop: spacing.sm,
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
