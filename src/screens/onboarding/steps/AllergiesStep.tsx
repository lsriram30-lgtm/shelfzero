import React from "react";
import { PillGrid } from "../PillGrid";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";
import { toggleValue } from "../toggleValue";

const OPTIONS = [
  "Peanuts",
  "Tree nuts",
  "Shellfish",
  "Fish",
  "Eggs",
  "Milk",
  "Soy",
  "Wheat",
  "Sesame",
  "None",
];

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AllergiesStep({ draft, update, onNext, onBack }: Props) {
  return (
    <OnboardingStepLayout
      step={5}
      totalSteps={8}
      title="Any allergies we should know about?"
      subtitle="We'll flag these when suggesting recipes."
      onNext={onNext}
      onBack={onBack}
    >
      <PillGrid
        options={OPTIONS}
        selected={draft.allergies}
        onToggle={(option) => update({ allergies: toggleValue(draft.allergies, option) })}
      />
    </OnboardingStepLayout>
  );
}
