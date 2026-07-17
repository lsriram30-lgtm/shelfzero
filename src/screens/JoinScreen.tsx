import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CommonActions, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { invitesApi } from "../api/invites";
import { Screen, Button } from "../components";
import { spacing, typography } from "../theme";
import { RootStackParamList } from "../navigation/types";

type JoinRouteProp = RouteProp<RootStackParamList, "Join">;
type JoinNavigationProp = NativeStackNavigationProp<RootStackParamList, "Join">;

type JoinState = "loading" | "success" | "error";

export function JoinScreen() {
  const { colors } = useTheme();
  const route = useRoute<JoinRouteProp>();
  const navigation = useNavigation<JoinNavigationProp>();
  const [state, setState] = useState<JoinState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    invitesApi
      .accept(route.params.token)
      .then(() => {
        if (!cancelled) setState("success");
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage(err instanceof Error ? err.message : "This invite link is no longer valid.");
          setState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [route.params.token]);

  const goToHousehold = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main", params: { screen: "HouseholdTab" } }],
      })
    );
  };

  return (
    <Screen>
      <View style={styles.center}>
        {state === "loading" ? (
          <>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={[styles.text, { color: colors.textMuted }]}>Joining household…</Text>
          </>
        ) : null}

        {state === "success" ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>You're in!</Text>
            <Text style={[styles.text, { color: colors.textMuted }]}>
              You've joined the household. Head over to see what's in the pantry.
            </Text>
            <Button label="Go to household" onPress={goToHousehold} style={styles.button} />
          </>
        ) : null}

        {state === "error" ? (
          <>
            <Text style={[styles.title, { color: colors.danger }]}>Invite link invalid</Text>
            <Text style={[styles.text, { color: colors.textMuted }]}>{message}</Text>
            <Button label="Back to app" onPress={goToHousehold} style={styles.button} />
          </>
        ) : null}
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
