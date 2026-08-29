import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Screen, Header, Button, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { isValidEmail } from "../../utils/validation";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";

type SignInNavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignIn">;

export function SignInScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<SignInNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fields always start empty here, so "any content typed" is dirty. A
  // successful sign-in swaps the whole navigator (Auth -> Main) rather than
  // popping this screen, so there's no beforeRemove to bypass on success.
  const isDirty = email.length > 0 || password.length > 0;
  useUnsavedChangesGuard(navigation, isDirty);

  const emailFormatValid = email.trim().length === 0 || isValidEmail(email);
  const emailError =
    email.trim().length > 0 && !isValidEmail(email)
      ? "Please enter a valid email address."
      : undefined;
  const canSubmit = email.trim().length > 0 && password.length > 0 && emailFormatValid;

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen avoidKeyboard>
      <Header title="Welcome back" subtitle="Sign in to your household" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
          placeholder="Your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        <Button
          label={submitting ? "Signing in…" : "Sign in"}
          onPress={handleSignIn}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submitButton}
        />
        <Button
          label="Forgot password?"
          variant="ghost"
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.switchButton}
        />
        <Button
          label="Don't have an account? Sign up"
          variant="ghost"
          onPress={() => navigation.navigate("SignUp")}
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
