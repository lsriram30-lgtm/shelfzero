import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme";

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {action}
    </View>
  );
}

export function CardHeaderLink({
  label,
  onPress,
  tone = "default",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text
        style={[
          styles.link,
          { color: tone === "danger" ? colors.danger : colors.primary },
          disabled ? styles.linkDisabled : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
  },
  link: {
    ...typography.bodyMedium,
  },
  linkDisabled: {
    opacity: 0.4,
  },
});
