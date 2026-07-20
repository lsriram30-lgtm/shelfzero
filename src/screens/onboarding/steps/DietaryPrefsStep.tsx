import React, { useMemo } from "react";
import { PillGrid } from "../PillGrid";
import { CustomOptionField } from "../CustomOptionField";
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

const ALL_OPTIONS = new Set(OPTIONS);

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DietaryPrefsStep({ draft, update, onNext, onBack }: Props) {
  const customPrefs = useMemo(
    () => draft.dietaryPrefs.filter((p) => !ALL_OPTIONS.has(p)),
    [draft.dietaryPrefs]
  );

  return (
    <OnboardingStepLayout
      step={3}
      totalSteps={7}
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

      <CustomOptionField
        customValues={customPrefs}
        onAdd={(value) => update({ dietaryPrefs: [...draft.dietaryPrefs, value] })}
        onRemove={(value) => update({ dietaryPrefs: toggleValue(draft.dietaryPrefs, value) })}
        placeholder="e.g. FODMAP-friendly, Halal, Kosher…"
      />
    </OnboardingStepLayout>
  );
}
