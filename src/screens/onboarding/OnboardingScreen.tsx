import React, { useState } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { initialOnboardingDraft, OnboardingDraft } from "./onboardingDraft";
import { NameLocationStep } from "./steps/NameLocationStep";
import { HouseholdSizeStep } from "./steps/HouseholdSizeStep";
import { LivingSituationStep } from "./steps/LivingSituationStep";
import { CuisinePrefsStep } from "./steps/CuisinePrefsStep";
import { DietaryPrefsStep } from "./steps/DietaryPrefsStep";
import { AllergiesStep } from "./steps/AllergiesStep";
import { GoalsStep } from "./steps/GoalsStep";
import { RecapStep } from "./steps/RecapStep";

const STEP_COUNT = 8;

export function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(initialOnboardingDraft);
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<OnboardingDraft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const goNext = () => setStepIndex((i) => Math.min(STEP_COUNT - 1, i + 1));
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await completeOnboarding(draft);
    } finally {
      setSubmitting(false);
    }
  };

  switch (stepIndex) {
    case 0:
      return <NameLocationStep draft={draft} update={update} onNext={goNext} />;
    case 1:
      return <HouseholdSizeStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 2:
      return <LivingSituationStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 3:
      return <CuisinePrefsStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 4:
      return <DietaryPrefsStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 5:
      return <AllergiesStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 6:
      return <GoalsStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
    case 7:
      return (
        <RecapStep draft={draft} onNext={handleFinish} onBack={goBack} submitting={submitting} />
      );
    default:
      return null;
  }
}
