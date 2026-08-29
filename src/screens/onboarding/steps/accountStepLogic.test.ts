import {
  AccountStepDerivedInput,
  accountStepNextLabel,
  accountStepSubtitle,
  accountStepTitle,
  canSubmitAccountStep,
} from "./accountStepLogic";

function baseInput(overrides: Partial<AccountStepDerivedInput> = {}): AccountStepDerivedInput {
  return {
    mode: "signup",
    email: "",
    password: "",
    confirmPassword: "",
    submitting: false,
    resetSent: false,
    ...overrides,
  };
}

describe("canSubmitAccountStep", () => {
  it("requires an email and password for sign up", () => {
    expect(canSubmitAccountStep(baseInput({ mode: "signup" }))).toBe(false);
    expect(
      canSubmitAccountStep(
        baseInput({ mode: "signup", email: "a@b.com", password: "hunter2", confirmPassword: "hunter2" })
      )
    ).toBe(true);
  });

  it("requires matching passwords for sign up but not sign in", () => {
    expect(
      canSubmitAccountStep(
        baseInput({ mode: "signup", email: "a@b.com", password: "hunter2", confirmPassword: "nope" })
      )
    ).toBe(false);
    expect(
      canSubmitAccountStep(baseInput({ mode: "signin", email: "a@b.com", password: "hunter2" }))
    ).toBe(true);
  });

  it("rejects a malformed email", () => {
    expect(
      canSubmitAccountStep(baseInput({ mode: "signin", email: "not-an-email", password: "hunter2" }))
    ).toBe(false);
  });

  it("reset mode before sending needs only a valid email, no password", () => {
    expect(canSubmitAccountStep(baseInput({ mode: "reset" }))).toBe(false);
    expect(canSubmitAccountStep(baseInput({ mode: "reset", email: "a@b.com" }))).toBe(true);
    expect(canSubmitAccountStep(baseInput({ mode: "reset", email: "not-an-email" }))).toBe(false);
  });

  it("reset mode is always submittable once the email has been sent", () => {
    expect(canSubmitAccountStep(baseInput({ mode: "reset", email: "", resetSent: true }))).toBe(true);
  });
});

describe("accountStepNextLabel", () => {
  it("labels sign up and sign in submission states", () => {
    expect(accountStepNextLabel(baseInput({ mode: "signup" }))).toBe("Continue");
    expect(accountStepNextLabel(baseInput({ mode: "signup", submitting: true }))).toBe(
      "Creating account…"
    );
    expect(accountStepNextLabel(baseInput({ mode: "signin", submitting: true }))).toBe(
      "Signing in…"
    );
  });

  it("labels the reset flow before, during, and after sending", () => {
    expect(accountStepNextLabel(baseInput({ mode: "reset" }))).toBe("Send reset link");
    expect(accountStepNextLabel(baseInput({ mode: "reset", submitting: true }))).toBe("Sending…");
    expect(accountStepNextLabel(baseInput({ mode: "reset", resetSent: true }))).toBe(
      "Back to sign in"
    );
  });
});

describe("accountStepTitle / accountStepSubtitle", () => {
  it("covers signup and signin copy", () => {
    expect(accountStepTitle({ mode: "signup", resetSent: false })).toBe("Create your account");
    expect(accountStepTitle({ mode: "signin", resetSent: false })).toBe("Welcome back");
    expect(accountStepSubtitle({ mode: "signup", resetSent: false })).toBe(
      "You'll use this to sign in next time."
    );
    expect(accountStepSubtitle({ mode: "signin", resetSent: false })).toBe(
      "Sign in to pick up where you left off."
    );
  });

  it("covers the reset flow before and after sending", () => {
    expect(accountStepTitle({ mode: "reset", resetSent: false })).toBe("Reset your password");
    expect(accountStepTitle({ mode: "reset", resetSent: true })).toBe("Check your email");
    expect(accountStepSubtitle({ mode: "reset", resetSent: false })).toBe(
      "We'll email you a link to reset it"
    );
    expect(accountStepSubtitle({ mode: "reset", resetSent: true })).toBe(
      "If an account exists for that email"
    );
  });
});
