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

export function CardHeaderLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.link, { color: colors.primary }]}>{label}</Text>
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
});
