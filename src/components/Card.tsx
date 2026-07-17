import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { radius, shadow, spacing } from "../theme";

export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadow.card,
  },
});
