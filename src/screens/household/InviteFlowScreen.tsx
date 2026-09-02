import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../../context/ThemeContext";
import { invitesApi } from "../../api/invites";
import { Screen, Header, Card, Button } from "../../components";
import { spacing, typography } from "../../theme";
import { inviteLink } from "../../utils/inviteLink";

// The backend has no way to actually deliver an invite by phone/email -
// POST /api/invites only ever creates a shareable link record regardless of
// what contact info is attached to it (confirmed live: nothing is sent
// anywhere, "Invite sent" was misleading). So this only ever generates a
// link for the household owner to share themselves, and doesn't ask for
// the invitee's name/role up front either - their real name and role come
// from their own account once they sign up/in and accept it, not a guess
// entered ahead of time here.
export function InviteFlowScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // name is required server-side even though it's not shown to the
      // invitee - role is left out entirely and defaults to "Member".
      const invite = await invitesApi.create({
        name: "Household invite",
        contact: "link",
        contactType: "link",
      });
      setLinkToken(invite.token);
    } catch (err) {
      Alert.alert(
        "Couldn't create invite link",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!linkToken) return;
    await Clipboard.setStringAsync(inviteLink(linkToken));
    setCopied(true);
  };

  return (
    <Screen>
      <Header title="Invite to household" />
      <View style={styles.content}>
        {linkToken ? (
          <Card style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>Invite link ready</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Share this however you like — text, email, anything. Whoever opens it just needs a
              ShelfZero account to join your household.
            </Text>
            <Text style={[styles.link, { color: colors.primary }]}>{inviteLink(linkToken)}</Text>
            <Button
              label={copied ? "Copied!" : "Copy invite link"}
              variant="outline"
              onPress={handleCopy}
              style={styles.actionButton}
            />
            <Button label="Done" onPress={() => navigation.goBack()} style={styles.actionButton} />
          </Card>
        ) : (
          <Card style={styles.card}>
            <Text style={[styles.title, { color: colors.text }]}>
              Invite someone to your household
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              This generates a link you share yourself — there's no way for the app to text or
              email it for you. Once they open it and sign in, they'll see your shared pantry,
              shopping list, and meal plan.
            </Text>
            <Button
              label={generating ? "Generating…" : "Generate invite link"}
              onPress={handleGenerate}
              loading={generating}
              disabled={generating}
              style={styles.actionButton}
            />
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  card: {
    alignItems: "center",
  },
  title: {
    ...typography.h2,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  link: {
    ...typography.body,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  actionButton: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
});
