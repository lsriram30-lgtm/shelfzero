import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CommonActions, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/OnboardingContext";
import { authApi, AuthError } from "../api/auth";
import { Screen, Header, Button, TextField } from "../components";
import { spacing, typography } from "../theme";
import { RootStackParamList } from "../navigation/types";
import { useUnsavedChangesGuard } from "../hooks/useUnsavedChangesGuard";

type ResetPasswordRouteProp = RouteProp<RootStackParamList, "ResetPassword">;
type ResetPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, "ResetPassword">;

export function ResetPasswordScreen() {
  const { colors } = useTheme();
  const route = useRoute<ResetPasswordRouteProp>();
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const { isSignedIn } = useAuth();
  const { isComplete } = useOnboarding();
  const token = route.params?.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const passwordsMatch = confirmPassword.length === 0 || confirmPassword === password;
  const canSubmit = password.length > 0 && password === confirmPassword;

  useUnsavedChangesGuard(navigation, !done && (password.length > 0 || confirmPassword.length > 0));

  // This screen is mounted regardless of auth/onboarding state (see
  // RootNavigator), so "Auth" isn't always a real registered route - e.g.
  // reached from onboarding's embedded AccountStep before onboarding is
  // complete, the stack only has "Onboarding" and "ResetPassword", and a
  // reset targeting "Auth" silently does nothing. Prefer just dismissing
  // back to whatever was already correctly showing; only fall back to a
  // state-aware reset (matching RootNavigator's own logic) when there's
  // nothing to go back to, e.g. a cold app launch from the emailed link.
  const goToSignIn = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const showAuth = !isSignedIn && isComplete;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          showAuth
            ? { name: "Auth", params: { screen: "SignIn" } }
            : isComplete
              ? { name: "Main" }
              : { name: "Onboarding" },
        ],
      })
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.title, { color: colors.danger }]}>Link invalid or expired</Text>
          <Text style={[styles.text, { color: colors.textMuted }]}>
            This reset link is no longer valid. Request a new one from the sign-in screen.
          </Text>
          <Button label="Back to sign in" onPress={goToSignIn} style={styles.button} />
        </View>
      </Screen>
    );
  }

  if (done) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.title, { color: colors.text }]}>Password reset</Text>
          <Text style={[styles.text, { color: colors.textMuted }]}>
            Your password has been changed. Sign in with your new password.
          </Text>
          <Button label="Sign in" onPress={goToSignIn} style={styles.button} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen avoidKeyboard>
      <Header title="Reset your password" subtitle="Choose a new password" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="New password"
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
          label={submitting ? "Resetting…" : "Reset password"}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submitButton}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    textAlign: "center",
  },
  text: {
    ...typography.body,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
});
