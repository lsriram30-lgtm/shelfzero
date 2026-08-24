import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { useTheme } from "../../context/ThemeContext";
import { authApi } from "../../api/auth";
import { Screen, Header, Button, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { isValidEmail } from "../../utils/validation";

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const emailFormatValid = email.trim().length === 0 || isValidEmail(email);
  const emailError =
    email.trim().length > 0 && !isValidEmail(email)
      ? "Please enter a valid email address."
      : undefined;
  const canSubmit = email.trim().length > 0 && emailFormatValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await authApi.requestPasswordReset(email.trim(), Linking.createURL("reset-password"));
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the reset link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Screen>
        <Header title="Check your email" subtitle="If an account exists for that email" />
        <View style={styles.content}>
          <Text style={[styles.body, { color: colors.text }]}>
            we've sent a link to reset your password. It can take a minute to arrive — check spam
            too if you don't see it.
          </Text>
          <Button
            label="Back to sign in"
            variant="outline"
            onPress={() => navigation.navigate("SignIn")}
            style={styles.submitButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen avoidKeyboard>
      <Header title="Forgot password?" subtitle="We'll email you a link to reset it" />
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
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        <Button
          label={submitting ? "Sending…" : "Send reset link"}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submitButton}
        />
        <Button
          label="Back to sign in"
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
  body: {
    ...typography.body,
    marginBottom: spacing.lg,
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
