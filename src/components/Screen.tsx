import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface ScreenProps extends ViewProps {
  // Opt-in: most screens are lists (often FlatList-based) that manage
  // their own scrolling, so this doesn't wrap every screen by default —
  // only form screens with fields need the keyboard pushed out of the way.
  avoidKeyboard?: boolean;
}

export function Screen({ style, children, avoidKeyboard, ...rest }: ScreenProps) {
  const { colors } = useTheme();
  const content = (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.safe}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
