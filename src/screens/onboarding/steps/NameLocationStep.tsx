import React from "react";
import { TextField } from "../../../components";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import { OnboardingDraft } from "../onboardingDraft";

interface Props {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  onNext: () => void;
}

export function NameLocationStep({ draft, update, onNext }: Props) {
  return (
    <OnboardingStepLayout
      step={0}
      totalSteps={8}
      title="Let's get to know you"
      subtitle="We'll use this to personalize your pantry and meal suggestions."
      onNext={onNext}
      nextDisabled={!draft.name.trim() || !draft.location.trim()}
    >
      <TextField
        label="Your name"
        placeholder="Jamie"
        value={draft.name}
        onChangeText={(name) => update({ name })}
      />
      <TextField
        label="Location"
        placeholder="City, State"
        value={draft.location}
        onChangeText={(location) => update({ location })}
      />
    </OnboardingStepLayout>
  );
}
