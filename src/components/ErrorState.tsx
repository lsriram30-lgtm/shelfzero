import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../theme";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Couldn't connect",
  message = "We couldn't reach the server. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {onRetry ? (
        <Button label="Try again" variant="outline" onPress={onRetry} style={styles.action} />
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
  },
  action: {
    marginTop: spacing.lg,
  },
});
