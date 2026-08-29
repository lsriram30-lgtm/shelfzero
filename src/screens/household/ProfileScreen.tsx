import React, { useEffect, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { useInvites } from "../../hooks/useInvites";
import { Screen, Header, Card, Button, Pill, CardHeader } from "../../components";
import { spacing, typography } from "../../theme";
import { HouseholdStackParamList } from "../../navigation/types";
import { PRIVACY_POLICY_URL } from "../../utils/privacyPolicy";
import { TERMS_OF_SERVICE_URL } from "../../utils/termsOfService";
import { SUPPORT_EMAIL_URL } from "../../utils/supportContact";
import { confirmDestructiveAction } from "../../utils/confirmDialog";
import { householdApi } from "../../api/household";

type ProfileNavigationProp = NativeStackNavigationProp<HouseholdStackParamList, "Profile">;

export function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const navigation = useNavigation<ProfileNavigationProp>();
  const { profile, resetOnboarding } = useOnboarding();
  const { invites, removeMember } = useInvites();
  const { signOut, currentEmail } = useAuth();
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [leavingHousehold, setLeavingHousehold] = useState(false);
  // Defaults to false (not just "unknown") so the remove-member action
  // stays hidden until we've actually confirmed ownership, rather than
  // flashing a control that a non-owner would just get a 403 from.
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    householdApi
      .me()
      .then((me) => setIsOwner(me.role === "owner"))
      .catch(() => {});
  }, []);

  const members = invites.filter((invite) => invite.status === "accepted");

  const handleResetForTesting = () => {
    confirmDestructiveAction({
      title: "Reset app for testing",
      message:
        "This signs you out and clears the local questionnaire status, so the next app open starts from the very first screen again. Your account and data on the server aren't affected.",
      confirmLabel: "Reset",
      onConfirm: async () => {
        try {
          // Sign out first: OnboardingScreen reads isSignedIn once at mount
          // to decide which step to start on, so clearing the profile first
          // (and letting RootNavigator swap it in while isSignedIn is still
          // momentarily true) locks in the wrong starting step.
          await signOut();
          await resetOnboarding();
        } catch (err) {
          Alert.alert(
            "Couldn't reset",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        }
      },
    });
  };

  const handleRemoveMember = (id: string, name: string) => {
    confirmDestructiveAction({
      title: "Remove member",
      message: `Remove ${name} from your household? They'll lose access to the shared pantry and shopping list.`,
      confirmLabel: "Remove",
      onConfirm: async () => {
        try {
          await removeMember(id);
        } catch (err) {
          Alert.alert(
            "Couldn't remove member",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        }
      },
    });
  };

  const handleLeaveHousehold = () => {
    confirmDestructiveAction({
      title: "Leave household",
      message:
        "You'll lose access to this household's shared pantry and shopping list, and a new, empty household will be set up for you instead. This can't be undone.",
      confirmLabel: "Leave",
      onConfirm: async () => {
        setLeavingHousehold(true);
        try {
          await householdApi.leave();
          await householdApi.create(profile?.name ? `${profile.name}'s Household` : "My Household");
        } catch (err) {
          Alert.alert(
            "Couldn't leave household",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        } finally {
          setLeavingHousehold(false);
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    confirmDestructiveAction({
      title: "Delete account",
      message:
        "This permanently deletes your account and your data. If you're the only member of your household, its pantry and shopping list are deleted too. This can't be undone.",
      confirmLabel: "Delete account",
      onConfirm: async () => {
        setDeletingAccount(true);
        try {
          await householdApi.deleteAccount();
          // Same ordering fix as "Reset app": sign out before clearing the
          // profile, so OnboardingScreen's mount-time isSignedIn check sees
          // the correct value and starts at the actual first step.
          await signOut();
          await resetOnboarding();
        } catch (err) {
          Alert.alert(
            "Couldn't delete account",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        } finally {
          setDeletingAccount(false);
        }
      },
    });
  };

  return (
    <Screen>
      <Header title="Profile" subtitle={profile?.name ?? "Your account"} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <CardHeader
            title="About you"
            action={
              <Button
                label="Edit"
                variant="outline"
                onPress={() => navigation.navigate("EditProfile")}
              />
            }
          />
          <Text style={[styles.detail, { color: colors.text }]}>
            {profile?.name ?? "—"} · {profile?.location ?? "—"}
          </Text>
          <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
            {(profile?.householdAdults ?? 1) + (profile?.householdKids ?? 0)} in household
            {profile?.householdKids ? ` (${profile.householdKids} kids)` : ""}
          </Text>
          {currentEmail ? (
            <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
              Signed in as {currentEmail}
            </Text>
          ) : null}
          {profile?.cuisinePrefs && profile.cuisinePrefs.length > 0 ? (
            <View style={styles.pillSection}>
              <Text style={[styles.pillSectionLabel, { color: colors.textMuted }]}>Cuisines</Text>
              <View style={styles.pillRow}>
                {profile.cuisinePrefs.map((pref) => (
                  <Pill key={pref} label={pref} />
                ))}
              </View>
            </View>
          ) : null}
          {profile?.dietaryPrefs && profile.dietaryPrefs.length > 0 ? (
            <View style={styles.pillSection}>
              <Text style={[styles.pillSectionLabel, { color: colors.textMuted }]}>Dietary</Text>
              <View style={styles.pillRow}>
                {profile.dietaryPrefs.map((pref) => (
                  <Pill key={pref} label={pref} />
                ))}
              </View>
            </View>
          ) : null}
          {profile?.allergies && profile.allergies.length > 0 ? (
            <View style={styles.pillSection}>
              <Text style={[styles.pillSectionLabel, { color: colors.textMuted }]}>Allergies</Text>
              <View style={styles.pillRow}>
                {profile.allergies.map((allergy) => (
                  <Pill key={allergy} label={allergy} />
                ))}
              </View>
            </View>
          ) : null}
          {profile?.goals && profile.goals.length > 0 ? (
            <View style={styles.pillSection}>
              <Text style={[styles.pillSectionLabel, { color: colors.textMuted }]}>Goals</Text>
              <View style={styles.pillRow}>
                {profile.goals.map((goal) => (
                  <Pill key={goal} label={goal} />
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title="Household members"
            action={
              <Button label="Invite" variant="outline" onPress={() => navigation.navigate("InviteFlow")} />
            }
          />
          {members.length === 0 ? (
            <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
              No members yet — invite someone to share your pantry.
            </Text>
          ) : (
            members.map((member) => (
              <View key={member.id} style={styles.memberRow}>
                <Text style={[styles.detail, { color: colors.text }]}>
                  {member.name} · {member.role}
                </Text>
                {isOwner ? (
                  <Pressable
                    onPress={() => handleRemoveMember(member.id, member.name)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${member.name} from household`}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>
            ))
          )}
          <Button
            label={leavingHousehold ? "Leaving…" : "Leave household"}
            variant="ghost"
            onPress={handleLeaveHousehold}
            disabled={leavingHousehold}
            loading={leavingHousehold}
            style={styles.leaveButton}
          />
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

        <Button
          label="Privacy Policy"
          variant="ghost"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          style={styles.signOutButton}
        />
        <Button
          label="Terms of Service"
          variant="ghost"
          onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}
          style={styles.signOutButton}
        />
        <Button
          label="Contact support"
          variant="ghost"
          onPress={() => Linking.openURL(SUPPORT_EMAIL_URL)}
          style={styles.signOutButton}
        />
        <Button label="Sign out" variant="neutral" onPress={signOut} style={styles.signOutButton} />
        {__DEV__ ? (
          <Button
            label="Reset app (testing)"
            variant="outline"
            onPress={handleResetForTesting}
            style={styles.signOutButton}
          />
        ) : null}
        <Button
          label={deletingAccount ? "Deleting…" : "Delete account"}
          variant="outline"
          onPress={handleDeleteAccount}
          disabled={deletingAccount}
          loading={deletingAccount}
          style={styles.signOutButton}
        />
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
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  detail: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leaveButton: {
    marginTop: spacing.sm,
  },
  detailMuted: {
    ...typography.caption,
  },
  pillSection: {
    marginTop: spacing.sm,
  },
  pillSectionLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
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
