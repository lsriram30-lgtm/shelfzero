import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useInvites } from "../../hooks/useInvites";
import { useShoppingList } from "../../hooks/useShoppingList";
import { useNotificationPreferences } from "../../context/NotificationPreferencesContext";
import { useDonations } from "../../context/DonationContext";
import {
  Screen,
  Header,
  Card,
  Button,
  TextField,
  ErrorState,
  CardHeader,
  CardHeaderLink,
  SwitchRow,
} from "../../components";
import { spacing, typography } from "../../theme";
import { HouseholdStackParamList } from "../../navigation/types";
import { inviteLink } from "../../utils/inviteLink";
import { confirmDestructiveAction } from "../../utils/confirmDialog";
import { ShoppingListItem } from "../../types";

type HouseholdNavigationProp = NativeStackNavigationProp<HouseholdStackParamList, "HouseholdHub">;

export function HouseholdHubScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<HouseholdNavigationProp>();
  const {
    invites,
    loading: invitesLoading,
    error: invitesError,
    refresh: refreshInvites,
    cancelInvite,
  } = useInvites();
  const {
    items: shoppingItems,
    loading: shoppingLoading,
    error: shoppingError,
    refresh: refreshShoppingList,
    addItem,
    toggleChecked,
    removeItem,
    clearChecked,
    setAllChecked,
  } = useShoppingList();
  const { totalItemsDonated } = useDonations();

  const refreshing = invitesLoading || shoppingLoading;
  const handleRefresh = () => {
    refreshInvites();
    refreshShoppingList();
  };

  const { notifyExpiry, notifyInvites, setNotifyExpiry, setNotifyInvites } =
    useNotificationPreferences();

  const [newItem, setNewItem] = useState("");
  const [clearedItems, setClearedItems] = useState<ShoppingListItem[] | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleCopyLink = async (token: string) => {
    await Clipboard.setStringAsync(inviteLink(token));
  };

  const handleAddShoppingItem = async () => {
    if (!newItem.trim()) return;
    await addItem({ name: newItem.trim(), qty: 1 });
    setNewItem("");
  };

  const handleCancelInvite = (id: string, name: string) => {
    confirmDestructiveAction({
      title: "Cancel invite",
      message: `Cancel the pending invite for ${name}?`,
      confirmLabel: "Cancel invite",
      cancelLabel: "Keep it",
      onConfirm: async () => {
        try {
          await cancelInvite(id);
        } catch (err) {
          Alert.alert(
            "Couldn't cancel invite",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        }
      },
    });
  };

  const pendingInvites = invites.filter((invite) => invite.status === "pending");
  const checkedCount = shoppingItems.filter((item) => item.checked).length;
  const allChecked = shoppingItems.length > 0 && checkedCount === shoppingItems.length;

  const handleClearChecked = () => {
    confirmDestructiveAction({
      title: "Clear checked items",
      message: `Remove ${checkedCount} checked item${checkedCount === 1 ? "" : "s"} from your shopping list?`,
      confirmLabel: "Clear",
      onConfirm: async () => {
        try {
          const cleared = await clearChecked();
          if (cleared.length === 0) return;
          setClearedItems(cleared);
          if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
          undoTimerRef.current = setTimeout(() => setClearedItems(null), 5000);
        } catch (err) {
          Alert.alert(
            "Couldn't clear items",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        }
      },
    });
  };

  const handleUndoClear = async () => {
    if (!clearedItems) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    const toRestore = clearedItems;
    setClearedItems(null);
    try {
      await Promise.all(toRestore.map((item) => addItem({ name: item.name, qty: item.quantity })));
    } catch (err) {
      Alert.alert(
        "Couldn't restore items",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const handleToggleSelectAll = async () => {
    try {
      await setAllChecked(!allChecked);
    } catch (err) {
      Alert.alert(
        "Couldn't update items",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Screen>
      <Header
        title="Household"
        subtitle="Members, shopping, and sharing"
        right={
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Ionicons name="person-circle-outline" size={28} color={colors.text} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <Card style={styles.card}>
          <CardHeader
            title="Members & invites"
            action={
              <CardHeaderLink label="Invite" onPress={() => navigation.navigate("InviteFlow")} />
            }
          />
          {invitesError && invites.length === 0 && !invitesLoading ? (
            <ErrorState
              title="Couldn't load invites"
              message={invitesError}
              onRetry={refreshInvites}
            />
          ) : pendingInvites.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              No pending invites. Invite someone to share this pantry.
            </Text>
          ) : (
            pendingInvites.map((invite) => (
              <View key={invite.id} style={[styles.inviteRow, { borderColor: colors.border }]}>
                <View style={styles.inviteInfo}>
                  <Text style={[styles.inviteName, { color: colors.text }]}>{invite.name}</Text>
                  <Text style={[styles.inviteMeta, { color: colors.textMuted }]}>
                    {invite.role} · pending
                  </Text>
                </View>
                <View style={styles.inviteActions}>
                  <Pressable
                    onPress={() => handleCopyLink(invite.token)}
                    accessibilityRole="button"
                    accessibilityLabel={`Copy invite link for ${invite.name}`}
                  >
                    <Ionicons name="link-outline" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleCancelInvite(invite.id, invite.name)}
                    accessibilityRole="button"
                    accessibilityLabel={`Cancel invite for ${invite.name}`}
                  >
                    <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={styles.card}>
          <CardHeader
            title="Shopping list"
            action={
              shoppingItems.length > 0 ? (
                <View style={styles.cardHeaderActions}>
                  <CardHeaderLink
                    label={allChecked ? "Deselect all" : "Select all"}
                    onPress={handleToggleSelectAll}
                  />
                  {checkedCount > 0 ? (
                    <CardHeaderLink label="Clear checked" onPress={handleClearChecked} />
                  ) : null}
                </View>
              ) : undefined
            }
          />
          <View style={styles.shoppingInputRow}>
            <View style={styles.shoppingInput}>
              <TextField
                placeholder="Add an item"
                value={newItem}
                onChangeText={setNewItem}
                onSubmitEditing={handleAddShoppingItem}
                returnKeyType="done"
              />
            </View>
            <Button label="Add" onPress={handleAddShoppingItem} style={styles.shoppingAddButton} />
          </View>
          {shoppingError && shoppingItems.length === 0 && !shoppingLoading ? (
            <ErrorState
              title="Couldn't load shopping list"
              message={shoppingError}
              onRetry={refreshShoppingList}
            />
          ) : shoppingItems.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Your shopping list is empty.
            </Text>
          ) : (
            shoppingItems.map((item) => (
              <View key={item.id} style={[styles.shoppingRow, { borderColor: colors.border }]}>
                <Pressable
                  style={styles.shoppingCheck}
                  onPress={() => toggleChecked(item.id, !item.checked)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                >
                  <Ionicons
                    name={item.checked ? "checkbox" : "square-outline"}
                    size={20}
                    color={item.checked ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.shoppingLabel,
                      {
                        color: item.checked ? colors.textMuted : colors.text,
                        textDecorationLine: item.checked ? "line-through" : "none",
                      },
                    ]}
                  >
                    {item.name} {item.quantity > 1 ? `(${item.quantity})` : ""}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name} from shopping list`}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            ))
          )}
          {clearedItems ? (
            <View style={[styles.undoBanner, { borderColor: colors.border }]}>
              <Text style={[styles.undoText, { color: colors.textMuted }]}>
                {clearedItems.length} item{clearedItems.length === 1 ? "" : "s"} cleared
              </Text>
              <CardHeaderLink label="Undo" onPress={handleUndoClear} />
            </View>
          ) : null}
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Donate surplus</Text>
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            {totalItemsDonated > 0
              ? `You've donated ${totalItemsDonated} item${
                  totalItemsDonated === 1 ? "" : "s"
                } so far — thank you!`
              : "Have extra food nearing expiry? Connect with a local donation partner."}
          </Text>
          <Button
            label="Donate items"
            variant="outline"
            onPress={() => navigation.navigate("Donate")}
            style={styles.donateButton}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Notifications</Text>
          <SwitchRow
            label="Expiry reminders"
            value={notifyExpiry}
            onValueChange={setNotifyExpiry}
            style={styles.switchRow}
          />
          <SwitchRow
            label="Invite activity"
            value={notifyInvites}
            onValueChange={setNotifyInvites}
            style={styles.switchRow}
          />
        </Card>
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
  empty: {
    ...typography.body,
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  inviteInfo: {
    flexShrink: 1,
  },
  inviteName: {
    ...typography.bodyMedium,
  },
  inviteMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  inviteActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cardHeaderActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  shoppingInputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  shoppingInput: {
    flex: 1,
  },
  shoppingAddButton: {
    paddingHorizontal: spacing.lg,
  },
  shoppingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  shoppingCheck: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
  },
  shoppingLabel: {
    ...typography.body,
    flexShrink: 1,
  },
  undoBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
  },
  undoText: {
    ...typography.caption,
  },
  switchRow: {
    paddingVertical: spacing.sm,
  },
  donateButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
});
