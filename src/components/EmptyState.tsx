import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon = "file-tray-outline",
}: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Ionicons name={icon} size={40} color={colors.textMuted} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  message: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.xl,
  },
});
