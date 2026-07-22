import React from "react";
import { PillGrid } from "../PillGrid";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";
import { toggleValue } from "../toggleValue";

const OPTIONS = [
  "Reduce food waste",
  "Save money",
  "Eat healthier",
  "Cook more often",
  "Plan meals ahead",
  "Simplify grocery shopping",
];

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GoalsStep({ draft, update, onNext, onBack }: Props) {
  return (
    <OnboardingStepLayout
      step={6}
      totalSteps={8}
      title="What are you hoping to get out of ShelfZero?"
      subtitle="Pick as many as you like."
      onNext={onNext}
      onBack={onBack}
    >
      <PillGrid
        options={OPTIONS}
        selected={draft.goals}
        onToggle={(option) => update({ goals: toggleValue(draft.goals, option) })}
      />
    </OnboardingStepLayout>
  );
}
