import React, { useMemo } from "react";
import { CustomOptionField } from "../CustomOptionField";
import { GroupedPillGrid, PillGroup } from "../GroupedPillGrid";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";
import { toggleValue } from "../toggleValue";

const GROUPS: PillGroup[] = [
  { label: "East Asian", options: ["Chinese", "Japanese", "Korean", "Taiwanese"] },
  { label: "South Asian", options: ["North Indian", "South Indian", "Pakistani", "Sri Lankan"] },
  {
    label: "Southeast Asian",
    options: ["Thai", "Vietnamese", "Indonesian", "Filipino", "Malaysian"],
  },
  {
    label: "Middle Eastern & Mediterranean",
    options: ["Mediterranean", "Lebanese", "Turkish", "Persian", "Greek", "Israeli"],
  },
  { label: "European", options: ["Italian", "French", "Spanish", "German", "British"] },
  {
    label: "Latin American",
    options: ["Mexican", "Peruvian", "Brazilian", "Caribbean", "Argentinian"],
  },
  { label: "African", options: ["Ethiopian", "Moroccan", "Nigerian"] },
  { label: "American", options: ["American", "Southern/BBQ", "Cajun/Creole", "Tex-Mex"] },
];

const ALL_OPTIONS = new Set(GROUPS.flatMap((group) => group.options));

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CuisinePrefsStep({ draft, update, onNext, onBack }: Props) {
  const customCuisines = useMemo(
    () => draft.cuisinePrefs.filter((c) => !ALL_OPTIONS.has(c)),
    [draft.cuisinePrefs]
  );

  return (
    <OnboardingStepLayout
      step={3}
      totalSteps={8}
      title="What cuisines do you enjoy?"
      subtitle="Pick as many as you like."
      onNext={onNext}
      onBack={onBack}
    >
      <GroupedPillGrid
        groups={GROUPS}
        selected={draft.cuisinePrefs}
        onToggle={(option) => update({ cuisinePrefs: toggleValue(draft.cuisinePrefs, option) })}
      />

      <CustomOptionField
        customValues={customCuisines}
        onAdd={(value) => update({ cuisinePrefs: [...draft.cuisinePrefs, value] })}
        onRemove={(value) => update({ cuisinePrefs: toggleValue(draft.cuisinePrefs, value) })}
        placeholder="e.g. Georgian, Uzbek, Cambodian…"
      />
    </OnboardingStepLayout>
  );
}
