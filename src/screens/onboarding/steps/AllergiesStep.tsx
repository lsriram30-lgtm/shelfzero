import React, { useMemo } from "react";
import { PillGrid } from "../PillGrid";
import { CustomOptionField } from "../CustomOptionField";
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

const ALL_OPTIONS = new Set(OPTIONS);

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AllergiesStep({ draft, update, onNext, onBack }: Props) {
  const customAllergies = useMemo(
    () => draft.allergies.filter((a) => !ALL_OPTIONS.has(a)),
    [draft.allergies]
  );

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

      <CustomOptionField
        customValues={customAllergies}
        allSelected={draft.allergies}
        onAdd={(value) => update({ allergies: [...draft.allergies, value] })}
        onRemove={(value) => update({ allergies: toggleValue(draft.allergies, value) })}
        placeholder="e.g. Kiwi, Mustard, Sulfites…"
      />
    </OnboardingStepLayout>
  );
}
