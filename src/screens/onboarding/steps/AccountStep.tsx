import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { AuthError } from "../../../api/auth";
import { TextField } from "../../../components";
import { isValidEmail } from "../../../utils/validation";
import { spacing, typography } from "../../../theme";
import { OnboardingStepLayout } from "../OnboardingStepLayout";

interface Props {
  onAccountCreated: () => void;
  onSignedIn: () => void | Promise<void>;
}

type Mode = "signup" | "signin";

export function AccountStep({ onAccountCreated, onSignedIn }: Props) {
  const { colors } = useTheme();
  const { signUp, signIn } = useAuth();

  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);

  const isSignUp = mode === "signup";
  const passwordsMatch = !isSignUp || confirmPassword.length === 0 || confirmPassword === password;
  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    (!isSignUp || password === confirmPassword);

  const resetMessages = () => {
    setError(null);
    setAccountExists(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setConfirmPassword("");
    resetMessages();
  };

  const handleTryDifferentEmail = () => {
    setEmail("");
    resetMessages();
  };

  const handleContinue = async () => {
    if (!canSubmit) return;
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    resetMessages();
    try {
      if (isSignUp) {
        const placeholderName = email.trim().split("@")[0];
        await signUp(placeholderName, email.trim(), password);
        onAccountCreated();
      } else {
        await signIn(email.trim(), password);
        // Signing in means you're a returning user — skip the rest of the
        // questionnaire entirely instead of asking again.
        await onSignedIn();
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
        setAccountExists(err.isAccountExists);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : `Couldn't ${isSignUp ? "create your account" : "sign in"}. Please try again.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={0}
      totalSteps={8}
      title={isSignUp ? "Create your account" : "Welcome back"}
      subtitle={
        isSignUp
          ? "You'll use this to sign in next time."
          : "Sign in to pick up where you left off."
      }
      onNext={handleContinue}
      nextLabel={submitting ? (isSignUp ? "Creating account…" : "Signing in…") : "Continue"}
      nextDisabled={!canSubmit || submitting}
    >
      <TextField
        label="Email"
        placeholder="name@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Password"
        placeholder={isSignUp ? "Choose a password" : "Your password"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isSignUp ? (
        <TextField
          label="Confirm password"
          placeholder="Type it again"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={passwordsMatch ? undefined : "Passwords don't match"}
        />
      ) : null}

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      {accountExists ? (
        <Pressable onPress={handleTryDifferentEmail}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Use a different email instead
          </Text>
        </Pressable>
      ) : null}

      <Pressable onPress={() => switchMode(isSignUp ? "signin" : "signup")}>
        <Text style={[styles.link, { color: colors.primary }]}>
          {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
        </Text>
      </Pressable>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  error: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  link: {
    ...typography.bodyMedium,
    marginTop: spacing.lg,
  },
});
