import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { Screen, Header, TextField, Button, Pill } from "../../components";
import { spacing, typography } from "../../theme";
import { PantryStackParamList } from "../../navigation/types";

const CATEGORIES = ["Produce", "Dairy", "Meat", "Pantry", "Frozen", "Bakery", "Beverages", "Other"];
const UNITS = ["ct", "lb", "oz", "g", "kg", "L", "mL"];
const EXPIRY_SHORTCUTS: { label: string; days: number }[] = [
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
];

function toDateInputString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

type AddRouteProp = RouteProp<PantryStackParamList, "AddPantryItem">;

export function AddPantryItemScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AddRouteProp>();
  const { addItem } = usePantry();

  const prefill = route.params?.prefill;

  const [name, setName] = useState(prefill?.name ?? "");
  const [category, setCategory] = useState(prefill?.category ?? CATEGORIES[0]);
  const [quantity, setQuantity] = useState(String(prefill?.quantity ?? 1));
  const [unit, setUnit] = useState(prefill?.unit ?? UNITS[0]);
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const parsedQuantity = Number(quantity);
  const canSubmit = name.trim().length > 0 && !Number.isNaN(parsedQuantity) && parsedQuantity > 0;

  const applyShortcut = (days: number) => {
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiresAt(toDateInputString(date));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await addItem({
        name: name.trim(),
        category,
        quantity: parsedQuantity,
        unit,
        expiresAt: expiresAt.trim() ? expiresAt.trim() : null,
        notes: notes.trim() ? notes.trim() : null,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Couldn't add item",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Header title="Add item" subtitle="Enter the details manually" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="Name"
          placeholder="e.g. Whole milk"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
        <View style={styles.pillRow}>
          {CATEGORIES.map((option) => (
            <Pill
              key={option}
              label={option}
              selected={category === option}
              onPress={() => setCategory(option)}
            />
          ))}
        </View>

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

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Unit</Text>
        <View style={styles.pillRow}>
          {UNITS.map((option) => (
            <Pill key={option} label={option} selected={unit === option} onPress={() => setUnit(option)} />
          ))}
        </View>

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
        <TextField
          placeholder="YYYY-MM-DD (optional)"
          value={expiresAt}
          onChangeText={setExpiresAt}
        />

        <TextField
          label="Notes"
          placeholder="Optional"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <Button
          label={submitting ? "Adding…" : "Add to pantry"}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submit}
        />
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
  submit: {
    marginTop: spacing.md,
  },
});
