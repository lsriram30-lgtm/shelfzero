import React from "react";
import { View } from "react-native";
import { Pill } from "../../../components";
import { spacing } from "../../../theme";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";

const OPTIONS = ["Living alone", "With roommates", "With partner", "With family", "With kids"];

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LivingSituationStep({ draft, update, onNext, onBack }: Props) {
  return (
    <OnboardingStepLayout
      step={2}
      totalSteps={8}
      title="What's your living situation?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!draft.livingSituation}
    >
      <View style={{ gap: spacing.sm }}>
        {OPTIONS.map((option) => (
          <Pill
            key={option}
            label={option}
            selected={draft.livingSituation === option}
            onPress={() => update({ livingSituation: option })}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}
