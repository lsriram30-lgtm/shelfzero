import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Screen, Button } from "../components";
import { spacing, typography } from "../theme";

// Shown in place of the main app when AuthContext detects this account no
// longer has the household it used to (see removedFromHousehold) - a
// household's name isn't something the client can generally look up (only
// the person who created it ever learns it, via the create-household
// response), so this deliberately doesn't try to name it.
export function RemovedFromHouseholdScreen() {
  const { colors } = useTheme();
  const { acknowledgeRemoval } = useAuth();
  const [continuing, setContinuing] = useState(false);

  const handleContinue = async () => {
    setContinuing(true);
    await acknowledgeRemoval();
  };

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text }]}>
          You've been removed from your household
        </Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>
          You no longer have access to that household's shared pantry, shopping list, and meal
          plan. We'll set you up with your own fresh household so you can keep using ShelfZero.
        </Text>
        <Button
          label={continuing ? "Setting up…" : "Continue"}
          onPress={handleContinue}
          loading={continuing}
          disabled={continuing}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
