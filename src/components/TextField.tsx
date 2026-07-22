import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { radius, spacing, typography } from "../theme";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, style, secureTextEntry, ...rest }: TextFieldProps) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(true);
  const isPasswordField = !!secureTextEntry;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPasswordField && hidden}
          style={[
            styles.input,
            isPasswordField && styles.inputWithIcon,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              color: colors.text,
            },
            style,
          ]}
          {...rest}
        />
        {isPasswordField ? (
          <Pressable
            style={styles.eyeButton}
            onPress={() => setHidden((current) => !current)}
            hitSlop={8}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  inputRow: {
    justifyContent: "center",
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputWithIcon: {
    paddingRight: spacing.xxxl,
  },
  eyeButton: {
    position: "absolute",
    right: spacing.md,
    padding: spacing.xs,
  },
  error: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
