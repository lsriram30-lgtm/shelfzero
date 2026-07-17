import React from "react";
import { PillGrid } from "../PillGrid";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";
import { toggleValue } from "../toggleValue";

const OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
  "Mediterranean",
  "American",
  "French",
  "Korean",
];

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CuisinePrefsStep({ draft, update, onNext, onBack }: Props) {
  return (
    <OnboardingStepLayout
      step={3}
      totalSteps={8}
      title="What cuisines do you enjoy?"
      subtitle="Pick as many as you like."
      onNext={onNext}
      onBack={onBack}
    >
      <PillGrid
        options={OPTIONS}
        selected={draft.cuisinePrefs}
        onToggle={(option) => update({ cuisinePrefs: toggleValue(draft.cuisinePrefs, option) })}
      />
    </OnboardingStepLayout>
  );
}
