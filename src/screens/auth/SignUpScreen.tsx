import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Screen, Header, Button, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

export function SignUpScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<SignUpNavigationProp>();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length > 0;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Header title="Create an account" subtitle="Set up your household" />
      <View style={styles.content}>
        <TextField label="Name" placeholder="Your name" value={name} onChangeText={setName} />
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
          placeholder="Choose a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        <Button
          label={submitting ? "Creating account…" : "Sign up"}
          onPress={handleSignUp}
          disabled={!canSubmit || submitting}
          loading={submitting}
          style={styles.submitButton}
        />
        <Button
          label="Already have an account? Sign in"
          variant="ghost"
          onPress={() => navigation.navigate("SignIn")}
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
