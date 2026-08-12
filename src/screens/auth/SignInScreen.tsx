import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Screen, Header, Button, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { isValidEmail } from "../../utils/validation";

type SignInNavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignIn">;

export function SignInScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<SignInNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <Screen>
      <Header title="Welcome back" subtitle="Sign in to your household" />
      <View style={styles.content}>
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
          label="Don't have an account? Sign up"
          variant="ghost"
          onPress={() => navigation.navigate("SignUp")}
          style={styles.switchButton}
        />
      </View>
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
