import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { initialOnboardingDraft, OnboardingDraft } from "./onboardingDraft";
import {
  clearOnboardingDraft,
  getOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/onboardingDraftCache";
import { hapticSuccess } from "../../utils/haptics";
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
  const { isSignedIn, currentEmail } = useAuth();
  // Always start at the account step. A genuine resume-after-restart is
  // handled below by the cached-draft restore, which sets stepIndex from
  // the real saved progress — this initial value should never itself skip
  // ahead, or a leftover/stale token with no cached draft shows the account
  // step as already passed when it wasn't.
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(initialOnboardingDraft);
  const [submitting, setSubmitting] = useState(false);
  // Gates autosaving until the resume-load below has had its chance to run,
  // so that effect doesn't stomp a real cached draft with the blank initial
  // one before it's even read.
  const [draftLoaded, setDraftLoaded] = useState(false);
  // Set as soon as the user does anything, so a slow-resolving resume-load
  // can never clobber input the user already typed after mount.
  const interactedRef = useRef(false);

  // Resume an in-progress questionnaire after the app was killed mid-flow.
  // Only runs once per mount: currentEmail is already stable by the time
  // this screen exists (RootNavigator holds off until AuthContext finishes
  // loading), and a fresh account created during this same session has no
  // prior draft to resume anyway.
  useEffect(() => {
    if (!isSignedIn) {
      setDraftLoaded(true);
      return;
    }
    let cancelled = false;
    getOnboardingDraft(currentEmail).then((cached) => {
      if (cancelled) return;
      if (cached && !interactedRef.current) {
        setDraft(cached.draft);
        setStepIndex(cached.stepIndex);
      }
      setDraftLoaded(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftLoaded || !isSignedIn) return;
    saveOnboardingDraft(draft, stepIndex, currentEmail);
  }, [draft, stepIndex, draftLoaded, isSignedIn, currentEmail]);

  const update = (patch: Partial<OnboardingDraft>) => {
    interactedRef.current = true;
    setDraft((prev) => ({ ...prev, ...patch }));
  };
  const goNext = () => {
    interactedRef.current = true;
    setStepIndex((i) => Math.min(STEP_COUNT - 1, i + 1));
  };
  const goBack = () => {
    interactedRef.current = true;
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await completeOnboarding(draft);
      await clearOnboardingDraft(currentEmail);
      hapticSuccess();
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
    await clearOnboardingDraft(currentEmail);
  };

  // Resuming after a restart: hold off rendering the (still-blank) draft
  // for the one frame it takes to check for a cached one, so there's no
  // flash of empty fields before they snap to the resumed answers.
  if (isSignedIn && !draftLoaded) return null;

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
