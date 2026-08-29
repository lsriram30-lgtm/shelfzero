import { isValidEmail } from "../../../utils/validation";

export type AccountStepMode = "signup" | "signin" | "reset";

export interface AccountStepDerivedInput {
  mode: AccountStepMode;
  email: string;
  password: string;
  confirmPassword: string;
  submitting: boolean;
  resetSent: boolean;
}

// Whether the step's single primary ("Continue"/"Send reset link"/"Back to
// sign in") button should be enabled. Split out from the component because
// the three modes (signup / signin / reset) each have different
// requirements, and "reset" itself has two sub-states (before and after the
// email is sent).
export function canSubmitAccountStep(input: AccountStepDerivedInput): boolean {
  const emailFormatValid = input.email.trim().length === 0 || isValidEmail(input.email);

  if (input.mode === "reset") {
    if (input.resetSent) return true;
    return input.email.trim().length > 0 && emailFormatValid;
  }

  const isSignUp = input.mode === "signup";
  return (
    input.email.trim().length > 0 &&
    input.password.length > 0 &&
    (!isSignUp || input.password === input.confirmPassword) &&
    emailFormatValid
  );
}

export function accountStepNextLabel(input: AccountStepDerivedInput): string {
  if (input.mode === "reset") {
    if (input.resetSent) return "Back to sign in";
    return input.submitting ? "Sending…" : "Send reset link";
  }
  if (input.submitting) return input.mode === "signup" ? "Creating account…" : "Signing in…";
  return "Continue";
}

type TitleSubtitleInput = Pick<AccountStepDerivedInput, "mode" | "resetSent">;

export function accountStepTitle(input: TitleSubtitleInput): string {
  if (input.mode === "reset") return input.resetSent ? "Check your email" : "Reset your password";
  return input.mode === "signup" ? "Create your account" : "Welcome back";
}

export function accountStepSubtitle(input: TitleSubtitleInput): string {
  if (input.mode === "reset") {
    return input.resetSent
      ? "If an account exists for that email"
      : "We'll email you a link to reset it";
  }
  return input.mode === "signup"
    ? "You'll use this to sign in next time."
    : "Sign in to pick up where you left off.";
}
