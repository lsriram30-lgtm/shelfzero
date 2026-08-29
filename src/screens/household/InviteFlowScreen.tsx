import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../../context/ThemeContext";
import { invitesApi } from "../../api/invites";
import { Screen, Header, Card, Button, Pill, TextField } from "../../components";
import { spacing, typography } from "../../theme";
import { ContactType } from "../../types";
import { inviteLink } from "../../utils/inviteLink";
import { isValidEmail, isValidPhone } from "../../utils/validation";
import { useUnsavedChangesGuard } from "../../hooks/useUnsavedChangesGuard";

type FlowStep = "choose" | "details" | "sent";

const ROLES = ["Adult", "Teen", "Child", "Guest"];

export function InviteFlowScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [step, setStep] = useState<FlowStep>("choose");
  const [contactType, setContactType] = useState<ContactType>("link");
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentToken, setSentToken] = useState<string | null>(null);

  // Once the invite is sent, there's nothing left to lose - leaving the
  // "sent" confirmation step shouldn't be second-guessed. ROLES[0] is the
  // untouched default, so picking a non-default role counts as a change
  // even before a name is typed, same as the category/unit pattern in
  // AddPantryItemScreen.
  const isDirty =
    step === "details" && (name.trim().length > 0 || contact.trim().length > 0 || role !== ROLES[0]);
  const allowLeave = useUnsavedChangesGuard(navigation, isDirty);

  const needsContact = contactType !== "link";
  const contactFormatValid =
    !needsContact ||
    contact.trim().length === 0 ||
    (contactType === "email" ? isValidEmail(contact) : isValidPhone(contact));
  const contactError =
    needsContact && contact.trim().length > 0 && !contactFormatValid
      ? contactType === "email"
        ? "Please enter a valid email address."
        : "Please enter a valid phone number."
      : undefined;
  const canSend =
    name.trim().length > 0 &&
    (!needsContact || (contact.trim().length > 0 && contactFormatValid));

  const handleChooseMethod = (method: ContactType) => {
    setContactType(method);
    setStep("details");
  };

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      const invite = await invitesApi.create({
        name: name.trim(),
        role,
        contact: contact.trim() || "link",
        contactType,
      });
      setSentToken(invite.token);
      setStep("sent");
    } catch (err) {
      Alert.alert(
        "Couldn't send invite",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    if (!sentToken) return;
    await Clipboard.setStringAsync(inviteLink(sentToken));
    setCopied(true);
  };

  return (
    <Screen avoidKeyboard>
      <Header title="Invite to household" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === "choose" ? (
          <View style={styles.methodList}>
            <Text style={[styles.stepLabel, { color: colors.textMuted }]}>
              How should we send the invite?
            </Text>
            <Pill label="Text a phone number" onPress={() => handleChooseMethod("phone")} />
            <Pill label="Send an email" onPress={() => handleChooseMethod("email")} />
            <Pill label="Just generate a link" onPress={() => handleChooseMethod("link")} />
          </View>
        ) : null}

        {step === "details" ? (
          <Card>
            <TextField label="Name" placeholder="Who are you inviting?" value={name} onChangeText={setName} />
            {needsContact ? (
              <TextField
                label={contactType === "phone" ? "Phone number" : "Email address"}
                placeholder={contactType === "phone" ? "(555) 123-4567" : "name@email.com"}
                keyboardType={contactType === "phone" ? "phone-pad" : "email-address"}
                value={contact}
                onChangeText={setContact}
                error={contactError}
              />
            ) : null}
            <Text style={[styles.stepLabel, { color: colors.textMuted }]}>Role</Text>
            <View style={styles.pillRow}>
              {ROLES.map((option) => (
                <Pill key={option} label={option} selected={role === option} onPress={() => setRole(option)} />
              ))}
            </View>
            <Button
              label={sending ? "Sending…" : "Send invite"}
              onPress={handleSend}
              disabled={!canSend || sending}
              loading={sending}
              style={styles.sendButton}
            />
          </Card>
        ) : null}

        {step === "sent" && sentToken ? (
          <Card style={styles.sentCard}>
            <Text style={[styles.sentTitle, { color: colors.text }]}>Invite sent</Text>
            <Text style={[styles.sentLink, { color: colors.primary }]}>{inviteLink(sentToken)}</Text>
            <Button
              label={copied ? "Copied!" : "Copy invite link"}
              variant="outline"
              onPress={handleCopy}
              style={styles.copyButton}
            />
            <Button
              label="Done"
              onPress={() => {
                allowLeave();
                navigation.goBack();
              }}
              style={styles.doneButton}
            />
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  methodList: {
    gap: spacing.sm,
  },
  stepLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sendButton: {
    marginTop: spacing.md,
  },
  sentCard: {
    alignItems: "center",
  },
  sentTitle: {
    ...typography.h2,
  },
  sentLink: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: "center",
  },
  copyButton: {
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
  doneButton: {
    marginTop: spacing.md,
    alignSelf: "stretch",
  },
});
