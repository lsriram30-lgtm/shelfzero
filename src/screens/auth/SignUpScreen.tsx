import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { AuthError } from "../../api/auth";
import { Screen, Header, Button, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { isValidEmail } from "../../utils/validation";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

export function SignUpScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<SignUpNavigationProp>();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);

  // Fields always start empty here, so "any content typed" is dirty. A
  // successful sign-up swaps the whole navigator (Auth -> Main/Onboarding)
  // rather than popping this screen, so there's no beforeRemove to bypass
  // on success.
  const isDirty =
    name.length > 0 || email.length > 0 || password.length > 0 || confirmPassword.length > 0;
  useUnsavedChangesGuard(navigation, isDirty);

  const passwordsMatch = confirmPassword.length === 0 || confirmPassword === password;
  const emailFormatValid = email.trim().length === 0 || isValidEmail(email);
  const emailError =
    email.trim().length > 0 && !isValidEmail(email)
      ? "Please enter a valid email address."
      : undefined;
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    password === confirmPassword &&
    emailFormatValid;

  const handleTryDifferentEmail = () => {
    setEmail("");
    setError(null);
    setAccountExists(false);
  };

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setAccountExists(false);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
        setAccountExists(err.isAccountExists);
      } else {
        setError(err instanceof Error ? err.message : "Couldn't create your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen avoidKeyboard>
      <Header title="Create an account" subtitle="Set up your household" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField label="Full Name" placeholder="First and last name" value={name} onChangeText={setName} />
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
          placeholder="Choose a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextField
          label="Confirm password"
          placeholder="Type it again"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={passwordsMatch ? undefined : "Passwords don't match"}
        />
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        <Button
          label={submitting ? "Creating account…" : "Sign up"}
          onPress={handleSignUp}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submitButton}
        />
        {accountExists ? (
          <Button
            label="Create new account anyway (use a different email)"
            variant="ghost"
            onPress={handleTryDifferentEmail}
            style={styles.switchButton}
          />
        ) : null}
        <Button
          label={accountExists ? "Sign in instead" : "Already have an account? Sign in"}
          variant="ghost"
          onPress={() => navigation.navigate("SignIn")}
          style={styles.switchButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  error: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  switchButton: {
    marginTop: spacing.md,
  },
});
