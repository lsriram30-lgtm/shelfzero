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
      step={1}
      totalSteps={8}
      title="How many people are in your household?"
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.stepper}>
        <Button
          label="−"
          variant="outline"
          onPress={() => update({ householdSize: Math.max(1, draft.householdSize - 1) })}
          style={styles.stepperButton}
        />
        <Text style={[styles.count, { color: colors.text }]}>{draft.householdSize}</Text>
        <Button
          label="+"
          variant="outline"
          onPress={() => update({ householdSize: Math.min(12, draft.householdSize + 1) })}
          style={styles.stepperButton}
        />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
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
