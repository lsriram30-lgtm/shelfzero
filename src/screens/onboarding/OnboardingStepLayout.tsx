import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Button, Screen } from "../../components";
import { spacing, typography, radius } from "../../theme";

interface OnboardingStepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function OnboardingStepLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
}: OnboardingStepLayoutProps) {
  const { colors } = useTheme();

  return (
    <Screen style={styles.container}>
      <View style={styles.progressTrack}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              { backgroundColor: i <= step ? colors.accent : colors.border },
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
        <View style={styles.body}>{children}</View>

        <View style={styles.footer}>
          {onBack ? (
            <Button label="Back" variant="ghost" onPress={onBack} style={styles.backButton} />
          ) : null}
          <Button
            label={nextLabel}
            onPress={onNext}
            disabled={nextDisabled}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressTrack: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: radius.pill,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
  },
  body: {
    marginTop: spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  backButton: {
    minWidth: 90,
  },
  nextButton: {
    flex: 1,
  },
});
