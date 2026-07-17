import React from "react";
import { PillGrid } from "../PillGrid";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";
import { toggleValue } from "../toggleValue";

const OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Low-carb",
  "Gluten-free",
  "Dairy-free",
  "No restrictions",
];

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DietaryPrefsStep({ draft, update, onNext, onBack }: Props) {
  return (
    <OnboardingStepLayout
      step={4}
      totalSteps={8}
      title="Any dietary preferences?"
      subtitle="Pick as many as you like."
      onNext={onNext}
      onBack={onBack}
    >
      <PillGrid
        options={OPTIONS}
        selected={draft.dietaryPrefs}
        onToggle={(option) => update({ dietaryPrefs: toggleValue(draft.dietaryPrefs, option) })}
      />
    </OnboardingStepLayout>
  );
}
