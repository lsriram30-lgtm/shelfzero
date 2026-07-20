import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Pill, TextField } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../theme";

interface CustomOptionFieldProps {
  customValues: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function CustomOptionField({
  customValues,
  onAdd,
  onRemove,
  placeholder = "Type your own…",
  label = "Don't see yours? Add it",
}: CustomOptionFieldProps) {
  const { colors } = useTheme();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const value = input.trim();
    if (!value || customValues.includes(value)) return;
    onAdd(value);
    setInput("");
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{label}</Text>
      {customValues.length > 0 ? (
        <View style={styles.wrap}>
          {customValues.map((value) => (
            <Pill key={value} label={value} selected onPress={() => onRemove(value)} />
          ))}
        </View>
      ) : null}
      <View style={styles.inputRow}>
        <TextField
          placeholder={placeholder}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          style={styles.input}
        />
        <Button label="Add" variant="outline" onPress={handleAdd} style={styles.addButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 0,
  },
});
