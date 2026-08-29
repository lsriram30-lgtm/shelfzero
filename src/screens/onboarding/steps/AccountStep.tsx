import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import * as Linking from "expo-linking";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { AuthError, authApi } from "../../../api/auth";
import { TextField } from "../../../components";
import { isValidEmail } from "../../../utils/validation";
import { spacing, typography } from "../../../theme";
import { OnboardingStepLayout } from "../OnboardingStepLayout";
import {
  AccountStepMode,
  accountStepNextLabel,
  accountStepSubtitle,
  accountStepTitle,
  canSubmitAccountStep,
} from "./accountStepLogic";

interface Props {
  onAccountCreated: () => void;
  onSignedIn: () => void | Promise<void>;
}

export function AccountStep({ onAccountCreated, onSignedIn }: Props) {
  const { colors } = useTheme();
  const { signUp, signIn } = useAuth();

  const [mode, setMode] = useState<AccountStepMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isSignUp = mode === "signup";
  const isReset = mode === "reset";
  const passwordsMatch = !isSignUp || confirmPassword.length === 0 || confirmPassword === password;
  const emailError =
    email.trim().length > 0 && !isValidEmail(email)
      ? "Please enter a valid email address."
      : undefined;
  const canSubmit = canSubmitAccountStep({
    mode,
    email,
    password,
    confirmPassword,
    submitting,
    resetSent,
  });

  const resetMessages = () => {
    setError(null);
    setAccountExists(false);
  };

  const switchMode = (next: AccountStepMode) => {
    setMode(next);
    setConfirmPassword("");
    setResetSent(false);
    resetMessages();
  };

  const handleTryDifferentEmail = () => {
    setEmail("");
    resetMessages();
  };

  const handleRequestReset = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    resetMessages();
    try {
      // Same request the standalone ForgotPasswordScreen makes — the emailed
      // link's `reset-password` deep link resolves via ResetPasswordScreen,
      // which RootNavigator mounts regardless of onboarding/auth state, so
      // it already works no matter where the link is requested from.
      await authApi.requestPasswordReset(email.trim(), Linking.createURL("reset-password"));
      setResetSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't send the reset link. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (isReset) {
      if (resetSent) {
        switchMode("signin");
        return;
      }
      await handleRequestReset();
      return;
    }

    if (!canSubmit) return;
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
      title={accountStepTitle({ mode, resetSent })}
      subtitle={accountStepSubtitle({ mode, resetSent })}
      onNext={handleContinue}
      nextLabel={accountStepNextLabel({ mode, email, password, confirmPassword, submitting, resetSent })}
      nextDisabled={!canSubmit || submitting}
    >
      {isReset ? (
        <>
          {resetSent ? (
            <Text style={[styles.body, { color: colors.text }]}>
              If an account exists for that email, we've sent a link to reset your password. It
              can take a minute to arrive — check spam too if you don't see it.
            </Text>
          ) : (
            <TextField
              label="Email"
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
          )}

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

          {resetSent ? null : (
            <Pressable onPress={() => switchMode("signin")}>
              <Text style={[styles.link, { color: colors.primary }]}>Back to sign in</Text>
            </Pressable>
          )}
        </>
      ) : (
        <>
          <TextField
            label="Email"
            placeholder="name@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={emailError}
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

          {!isSignUp ? (
            <Pressable onPress={() => switchMode("reset")}>
              <Text style={[styles.link, { color: colors.primary }]}>Forgot password?</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={() => switchMode(isSignUp ? "signin" : "signup")}>
            <Text style={[styles.link, { color: colors.primary }]}>
              {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
            </Text>
          </Pressable>
        </>
      )}
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
  },
  error: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  link: {
    ...typography.bodyMedium,
    marginTop: spacing.lg,
  },
});
