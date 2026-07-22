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
  const { addItem, updateItem, removeItem } = usePantry();

  const prefill = route.params?.prefill;
  const editingItem = route.params?.item;
  const isEditing = !!editingItem;

  const [name, setName] = useState(editingItem?.name ?? prefill?.name ?? "");
  const [category, setCategory] = useState(editingItem?.category ?? prefill?.category ?? CATEGORIES[0]);
  const [quantity, setQuantity] = useState(String(editingItem?.quantity ?? prefill?.quantity ?? 1));
  const [unit, setUnit] = useState(editingItem?.unit ?? prefill?.unit ?? UNITS[0]);
  const [expiresAt, setExpiresAt] = useState(editingItem?.expiresAt ?? "");
  const [notes, setNotes] = useState(editingItem?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const payload = {
        name: name.trim(),
        category,
        quantity: parsedQuantity,
        unit,
        expiresAt: expiresAt.trim() ? expiresAt.trim() : null,
        notes: notes.trim() ? notes.trim() : null,
      };
      if (editingItem) {
        await updateItem(editingItem.id, payload);
      } else {
        await addItem(payload);
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
    Alert.alert("Remove item", `Remove ${editingItem.name} from your pantry?`, [
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
  submit: {
    marginTop: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
});
