import React from "react";
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme";

export function SwitchRow({
  label,
  hint,
  value,
  onValueChange,
  style,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, style]}>
      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    ...typography.bodyMedium,
  },
  hint: {
    ...typography.caption,
    marginTop: 2,
  },
});
