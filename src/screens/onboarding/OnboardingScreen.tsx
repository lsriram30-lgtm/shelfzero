import React, { useState } from "react";
import { Alert } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { initialOnboardingDraft, OnboardingDraft } from "./onboardingDraft";
import { AccountStep } from "./steps/AccountStep";
import { NameLocationStep } from "./steps/NameLocationStep";
import { HouseholdSizeStep } from "./steps/HouseholdSizeStep";
import { CuisinePrefsStep } from "./steps/CuisinePrefsStep";
import { DietaryPrefsStep } from "./steps/DietaryPrefsStep";
import { AllergiesStep } from "./steps/AllergiesStep";
import { GoalsStep } from "./steps/GoalsStep";
import { RecapStep } from "./steps/RecapStep";

const STEP_COUNT = 8;

export function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const { isSignedIn } = useAuth();
  // Already signed in (e.g. resuming onboarding after a restart) — skip
  // straight past the account step, no need to sign in again.
  const firstStep = isSignedIn ? 1 : 0;
  const [stepIndex, setStepIndex] = useState(firstStep);
  const [draft, setDraft] = useState<OnboardingDraft>(initialOnboardingDraft);
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<OnboardingDraft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const goNext = () => setStepIndex((i) => Math.min(STEP_COUNT - 1, i + 1));
  const goBack = () => setStepIndex((i) => Math.max(firstStep, i - 1));

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await completeOnboarding(draft);
    } catch (err) {
      Alert.alert(
        "Couldn't finish setup",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Signing in (as opposed to signing up) means you're a returning user —
  // mark onboarding complete immediately instead of asking the rest of the
  // questions again. There's no local record of previous answers on this
  // device, so this falls back to defaults rather than leaving the app in
  // an inconsistent "signed in but not onboarded" state.
  const handleSignedIn = async () => {
    await completeOnboarding(initialOnboardingDraft);
  };

  switch (stepIndex) {
    case 0:
      return <AccountStep onAccountCreated={goNext} onSignedIn={handleSignedIn} />;
    case 1:
      return <NameLocationStep draft={draft} update={update} onNext={goNext} />;
    case 2:
      return <HouseholdSizeStep draft={draft} update={update} onNext={goNext} onBack={goBack} />;
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
