import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Card } from "../../../components";
import { spacing, typography } from "../../../theme";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";

interface Props {
  draft: OnboardingDraft;
  onNext: () => void;
  onBack: () => void;
  submitting?: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value || "—"}</Text>
    </View>
  );
}

export function RecapStep({ draft, onNext, onBack, submitting }: Props) {
  return (
    <OnboardingStepLayout
      step={6}
      totalSteps={7}
      title="You're all set"
      subtitle="Here's what we'll use to personalize ShelfZero."
      onNext={onNext}
      onBack={onBack}
      nextLabel={submitting ? "Saving…" : "Finish"}
      nextDisabled={submitting}
    >
      <Card>
        <Row label="Name" value={draft.name} />
        <Row label="Location" value={draft.location} />
        <Row
          label="Household"
          value={`${draft.householdAdults} adult${draft.householdAdults === 1 ? "" : "s"}${
            draft.householdKids > 0
              ? `, ${draft.householdKids} kid${draft.householdKids === 1 ? "" : "s"}`
              : ""
          }`}
        />
        <Row label="Cuisines" value={draft.cuisinePrefs.join(", ")} />
        <Row label="Dietary preferences" value={draft.dietaryPrefs.join(", ")} />
        <Row label="Allergies" value={draft.allergies.join(", ")} />
        <Row label="Goals" value={draft.goals.join(", ")} />
      </Card>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
  },
  rowLabel: {
    ...typography.label,
  },
  rowValue: {
    ...typography.body,
    marginTop: spacing.xs / 2,
  },
});
