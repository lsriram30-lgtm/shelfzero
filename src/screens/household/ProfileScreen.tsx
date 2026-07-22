import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { useInvites } from "../../hooks/useInvites";
import { Screen, Header, Card, Button, Pill } from "../../components";
import { spacing, typography } from "../../theme";
import { HouseholdStackParamList } from "../../navigation/types";

type ProfileNavigationProp = NativeStackNavigationProp<HouseholdStackParamList, "Profile">;

export function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const navigation = useNavigation<ProfileNavigationProp>();
  const { profile } = useOnboarding();
  const { invites } = useInvites();
  const { signOut } = useAuth();

  const members = invites.filter((invite) => invite.status === "accepted");

  return (
    <Screen>
      <Header title="Profile" subtitle={profile?.name ?? "Your account"} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>About you</Text>
          <Text style={[styles.detail, { color: colors.text }]}>
            {profile?.name ?? "—"} · {profile?.location ?? "—"}
          </Text>
          <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
            {(profile?.householdAdults ?? 1) + (profile?.householdKids ?? 0)} in household
            {profile?.householdKids ? ` (${profile.householdKids} kids)` : ""}
          </Text>
          {profile?.dietaryPrefs && profile.dietaryPrefs.length > 0 ? (
            <View style={styles.pillRow}>
              {profile.dietaryPrefs.map((pref) => (
                <Pill key={pref} label={pref} />
              ))}
            </View>
          ) : null}
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Household members</Text>
            <Button label="Invite" variant="outline" onPress={() => navigation.navigate("InviteFlow")} />
          </View>
          {members.length === 0 ? (
            <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
              No members yet — invite someone to share your pantry.
            </Text>
          ) : (
            members.map((member) => (
              <Text key={member.id} style={[styles.detail, { color: colors.text }]}>
                {member.name} · {member.role}
              </Text>
            ))
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>
          <View style={styles.pillRow}>
            {(["light", "dark", "system"] as const).map((option) => (
              <Pill
                key={option}
                label={option.charAt(0).toUpperCase() + option.slice(1)}
                selected={mode === option}
                onPress={() => setMode(option)}
              />
            ))}
          </View>
        </Card>

        <Button label="Sign out" variant="neutral" onPress={signOut} style={styles.signOutButton} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  card: {},
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  detail: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  detailMuted: {
    ...typography.caption,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  signOutButton: {
    marginHorizontal: spacing.xl,
  },
});
