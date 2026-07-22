import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "../../../components";
import { spacing, typography } from "../../../theme";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HouseholdSizeStep({ draft, update, onNext, onBack }: Props) {
  const { colors } = useTheme();

  return (
    <OnboardingStepLayout
      step={2}
      totalSteps={8}
      title="Who's in your household?"
      subtitle="This helps us size recipes and portions correctly."
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.group}>
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>Adults</Text>
        <View style={styles.stepper}>
          <Button
            label="−"
            variant="outline"
            onPress={() => update({ householdAdults: Math.max(1, draft.householdAdults - 1) })}
            style={styles.stepperButton}
          />
          <Text style={[styles.count, { color: colors.text }]}>{draft.householdAdults}</Text>
          <Button
            label="+"
            variant="outline"
            onPress={() => update({ householdAdults: Math.min(12, draft.householdAdults + 1) })}
            style={styles.stepperButton}
          />
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>Kids</Text>
        <View style={styles.stepper}>
          <Button
            label="−"
            variant="outline"
            onPress={() => update({ householdKids: Math.max(0, draft.householdKids - 1) })}
            style={styles.stepperButton}
          />
          <Text style={[styles.count, { color: colors.text }]}>{draft.householdKids}</Text>
          <Button
            label="+"
            variant="outline"
            onPress={() => update({ householdKids: Math.min(12, draft.householdKids + 1) })}
            style={styles.stepperButton}
          />
        </View>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  group: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  groupLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  stepperButton: {
    width: 56,
    paddingHorizontal: 0,
  },
  count: {
    ...typography.display,
    minWidth: 60,
    textAlign: "center",
  },
});
