import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { Screen, Header, TextField, Button, Pill, SwitchRow } from "../../components";
import { spacing, typography } from "../../theme";
import { PantryStackParamList } from "../../navigation/types";
import { DateParts, fromIsoDate, isDateComplete, isDateEmpty, onlyDigits, toIsoDate } from "../../utils/dateInput";
import {
  filterByAllergies,
  filterByDietaryPrefs,
  filterCategoriesByDietaryPrefs,
  suggestCategory,
} from "./pantryLogic";
import { getCachedMealPlan } from "../../utils/mealPlanCache";

const CATEGORIES = ["Produce", "Dairy", "Meat", "Pantry", "Frozen", "Bakery", "Beverages", "Other"];
const UNITS = ["ct", "lb", "oz", "g", "kg", "L", "mL", "Other"];
const STAPLES: { name: string; category: string; unit: string; quantity?: number; dietTags?: string[] }[] = [
  { name: "Milk", category: "Dairy", unit: "L", dietTags: ["dairy"] },
  { name: "Eggs", category: "Dairy", unit: "ct", quantity: 12, dietTags: ["egg"] },
  { name: "Bread", category: "Bakery", unit: "ct", dietTags: ["wheat"] },
  { name: "Butter", category: "Dairy", unit: "ct", dietTags: ["dairy"] },
  { name: "Rice", category: "Pantry", unit: "lb" },
  { name: "Bananas", category: "Produce", unit: "ct", quantity: 6 },
  { name: "Chicken Breast", category: "Meat", unit: "lb", dietTags: ["meat"] },
];
const EXPIRY_SHORTCUTS: { label: string; days: number }[] = [
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
];

function partsFromDate(date: Date): DateParts {
  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

type AddRouteProp = RouteProp<PantryStackParamList, "AddPantryItem">;

export function AddPantryItemScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AddRouteProp>();
  const { addItem, updateItem, removeItem, isAutoAddOptedOut, setAutoAddOptOut } = usePantry();
  const { profile } = useOnboarding();
  const { currentEmail } = useAuth();

  const prefill = route.params?.prefill;
  const editingItem = route.params?.item;
  const isEditing = !!editingItem;
  const dietaryPrefs = profile?.dietaryPrefs ?? [];
  const allergies = profile?.allergies ?? [];
  // Only filter for a brand-new item — hiding a category or staple based on
  // the current diet/allergies must never hide what an existing item is
  // already set to, e.g. editing a meat item you added before going vegetarian.
  const visibleCategories = isEditing
    ? CATEGORIES
    : filterCategoriesByDietaryPrefs(CATEGORIES, dietaryPrefs);
  const visibleStaples = isEditing
    ? STAPLES
    : filterByAllergies(filterByDietaryPrefs(STAPLES, dietaryPrefs), allergies);

  const initialCategoryRaw = editingItem?.category ?? prefill?.category ?? CATEGORIES[0];
  const initialCategoryIsCustom = !CATEGORIES.includes(initialCategoryRaw);
  const initialUnitRaw = editingItem?.unit ?? prefill?.unit ?? UNITS[0];
  const initialUnitIsCustom = !UNITS.includes(initialUnitRaw);

  const [name, setName] = useState(editingItem?.name ?? prefill?.name ?? "");
  const [category, setCategory] = useState(initialCategoryIsCustom ? "Other" : initialCategoryRaw);
  const [customCategory, setCustomCategory] = useState(
    initialCategoryIsCustom ? initialCategoryRaw : ""
  );
  const [categoryTouched, setCategoryTouched] = useState(!!editingItem || !!prefill?.category);
  const [quantity, setQuantity] = useState(String(editingItem?.quantity ?? prefill?.quantity ?? 1));
  const [unit, setUnit] = useState(initialUnitIsCustom ? "Other" : initialUnitRaw);
  const [customUnit, setCustomUnit] = useState(initialUnitIsCustom ? initialUnitRaw : "");
  const [expiryParts, setExpiryParts] = useState<DateParts>(() =>
    fromIsoDate(editingItem?.expiresAt)
  );
  const [notes, setNotes] = useState(editingItem?.notes ?? "");
  const [autoAddEnabled, setAutoAddEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isInCurrentPlan, setIsInCurrentPlan] = useState(false);

  useEffect(() => {
    if (!editingItem) return;
    let cancelled = false;
    isAutoAddOptedOut(editingItem.id).then((optedOut) => {
      if (!cancelled) setAutoAddEnabled(!optedOut);
    });
    return () => {
      cancelled = true;
    };
  }, [editingItem?.id, isAutoAddOptedOut]);

  useEffect(() => {
    if (!editingItem) return;
    let cancelled = false;
    getCachedMealPlan(currentEmail).then((cached) => {
      if (!cancelled && cached?.pantryItemNames.includes(editingItem.name)) {
        setIsInCurrentPlan(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [editingItem?.name, currentEmail]);

  const parsedQuantity = Number(quantity);
  const minQuantity = isEditing ? 0 : 1;
  const expiryComplete = isDateComplete(expiryParts);
  const expiryEmpty = isDateEmpty(expiryParts);
  const isoExpiry = expiryComplete ? toIsoDate(expiryParts) : null;
  const expiryError =
    expiryComplete && !isoExpiry
      ? "That's not a real date."
      : !expiryEmpty && !expiryComplete
        ? "Enter a full month, day, and year, or leave it blank."
        : undefined;
  const canSubmit =
    name.trim().length > 0 &&
    !Number.isNaN(parsedQuantity) &&
    parsedQuantity >= minQuantity &&
    (expiryEmpty || !!isoExpiry);

  const handleNameChange = (text: string) => {
    setName(text);
    if (!isEditing && !categoryTouched) {
      const suggested = suggestCategory(text);
      if (suggested && visibleCategories.includes(suggested)) setCategory(suggested);
    }
  };

  const handleCategorySelect = (option: string) => {
    setCategory(option);
    setCategoryTouched(true);
  };

  const handleStapleSelect = (staple: (typeof STAPLES)[number]) => {
    setName(staple.name);
    setCategory(staple.category);
    setCategoryTouched(true);
    setUnit(staple.unit);
    if (staple.quantity) setQuantity(String(staple.quantity));
  };

  const setExpiryField = (field: keyof DateParts, maxLength: number) => (text: string) => {
    setExpiryParts((prev) => ({ ...prev, [field]: onlyDigits(text, maxLength) }));
  };

  const applyShortcut = (days: number) => {
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiryParts(partsFromDate(date));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const resolvedCategory =
        category === "Other" && customCategory.trim() ? customCategory.trim() : category;
      const resolvedUnit = unit === "Other" && customUnit.trim() ? customUnit.trim() : unit;
      const payload = {
        name: name.trim(),
        category: resolvedCategory,
        quantity: parsedQuantity,
        unit: resolvedUnit,
        expiresAt: isoExpiry,
        notes: notes.trim() ? notes.trim() : null,
      };
      if (editingItem) {
        await setAutoAddOptOut(editingItem.id, !autoAddEnabled);
        await updateItem(editingItem.id, payload);
      } else {
        const created = await addItem(payload);
        if (!autoAddEnabled) {
          await setAutoAddOptOut(created.id, true);
        }
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        isEditing ? "Couldn't save changes" : "Couldn't add item",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!editingItem) return;
    const message = isInCurrentPlan
      ? `Remove ${editingItem.name} from your pantry? It's part of your current meal plan, so you may want to regenerate the plan afterward.`
      : `Remove ${editingItem.name} from your pantry?`;
    Alert.alert("Remove item", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await removeItem(editingItem.id);
            navigation.goBack();
          } catch (err) {
            Alert.alert(
              "Couldn't remove item",
              err instanceof Error ? err.message : "Something went wrong. Please try again."
            );
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <Header
        title={isEditing ? "Edit item" : "Add item"}
        subtitle={isEditing ? "Update the details or remove it" : "Enter the details manually"}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isEditing && !prefill && name.trim().length === 0 && visibleStaples.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Quick add</Text>
            <View style={styles.pillRow}>
              {visibleStaples.map((staple) => (
                <Pill
                  key={staple.name}
                  label={staple.name}
                  onPress={() => handleStapleSelect(staple)}
                />
              ))}
            </View>
          </>
        ) : null}

        <TextField
          label="Name"
          placeholder="e.g. Whole milk"
          value={name}
          onChangeText={handleNameChange}
          autoFocus
        />

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
        <View style={styles.pillRow}>
          {visibleCategories.map((option) => (
            <Pill
              key={option}
              label={option}
              selected={category === option}
              onPress={() => handleCategorySelect(option)}
            />
          ))}
        </View>
        {category === "Other" ? (
          <TextField
            placeholder="Enter a category"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
        ) : null}

        <View style={styles.row}>
          <View style={styles.quantityField}>
            <TextField
              label="Quantity"
              placeholder="1"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
        </View>
        {isEditing ? (
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Set quantity to 0 if you've run out — it'll be added to your shopping list
            automatically.
          </Text>
        ) : null}

        <SwitchRow
          label="Auto-add to shopping list when it runs out"
          hint="Turn off for one-time buys you don't want to restock automatically."
          value={autoAddEnabled}
          onValueChange={setAutoAddEnabled}
          style={styles.switchRow}
        />

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Unit</Text>
        <View style={styles.pillRow}>
          {UNITS.map((option) => (
            <Pill key={option} label={option} selected={unit === option} onPress={() => setUnit(option)} />
          ))}
        </View>
        {unit === "Other" ? (
          <TextField
            placeholder="Enter a unit (e.g. bunch, jar, box)"
            value={customUnit}
            onChangeText={setCustomUnit}
          />
        ) : null}

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Expires</Text>
        <View style={styles.pillRow}>
          {EXPIRY_SHORTCUTS.map((shortcut) => (
            <Pill
              key={shortcut.label}
              label={shortcut.label}
              onPress={() => applyShortcut(shortcut.days)}
            />
          ))}
        </View>
        <View style={styles.dateRow}>
          <View style={styles.dateFieldMonth}>
            <TextField
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={expiryParts.month}
              onChangeText={setExpiryField("month", 2)}
            />
          </View>
          <View style={styles.dateFieldDay}>
            <TextField
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              value={expiryParts.day}
              onChangeText={setExpiryField("day", 2)}
            />
          </View>
          <View style={styles.dateFieldYear}>
            <TextField
              placeholder="YYYY"
              keyboardType="number-pad"
              maxLength={4}
              value={expiryParts.year}
              onChangeText={setExpiryField("year", 4)}
            />
          </View>
        </View>
        {expiryError ? (
          <Text style={[styles.dateError, { color: colors.danger }]}>{expiryError}</Text>
        ) : null}

        <TextField
          label="Notes"
          placeholder="Optional"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <Button
          label={submitting ? (isEditing ? "Saving…" : "Adding…") : isEditing ? "Save changes" : "Add to pantry"}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting || deleting}
          loading={submitting}
          style={styles.submit}
        />

        {isEditing ? (
          <Button
            label={deleting ? "Removing…" : "Remove item"}
            variant="outline"
            onPress={handleDelete}
            disabled={submitting || deleting}
            loading={deleting}
            style={styles.deleteButton}
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
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
  },
  quantityField: {
    flex: 1,
  },
  hint: {
    ...typography.caption,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  switchRow: {
    marginBottom: spacing.lg,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateFieldMonth: {
    flex: 1,
  },
  dateFieldDay: {
    flex: 1,
  },
  dateFieldYear: {
    flex: 1.5,
  },
  dateError: {
    ...typography.caption,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  submit: {
    marginTop: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
});
