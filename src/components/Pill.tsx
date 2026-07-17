import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { radius, spacing, typography } from "../theme";

interface PillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: "default" | "accent" | "danger" | "success" | "warning";
}

export function Pill({ label, selected, onPress, tone = "default" }: PillProps) {
  const { colors } = useTheme();

  const toneColor =
    tone === "accent"
      ? colors.accent
      : tone === "danger"
      ? colors.danger
      : tone === "success"
      ? colors.success
      : tone === "warning"
      ? colors.warning
      : colors.secondary;

  const content = (
    <Text
      style={[
        styles.label,
        {
          color: selected ? colors.surface : colors.text,
        },
      ]}
    >
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <Text
        style={[
          styles.pill,
          styles.label,
          {
            backgroundColor: toneColor,
            color: colors.text,
          },
        ]}
      >
        {label}
      </Text>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: "flex-start",
  },
  label: {
    ...typography.label,
  },
});
