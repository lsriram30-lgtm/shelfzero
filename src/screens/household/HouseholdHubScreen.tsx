import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, Share, StyleSheet, Text, View } from "react-native";
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
import { hapticTap } from "../../utils/haptics";
import { ShoppingListItem } from "../../types";
import { sendTestNotification } from "../../notifications/expiryNotifications";
import {
  findMatchingUnchecked,
  formatShoppingListForShare,
  groupShoppingListByCategory,
  toggleSelectAll,
  toggleSelection,
} from "./shoppingListLogic";

type HouseholdNavigationProp = NativeStackNavigationProp<HouseholdStackParamList, "HouseholdHub">;

function ShoppingRow({
  item,
  selectionMode,
  selected,
  onToggle,
  onChangeQuantity,
  onRemove,
  pendingQuantityIds,
}: {
  item: ShoppingListItem;
  selectionMode: boolean;
  selected: boolean;
  onToggle: () => void;
  onChangeQuantity: (item: ShoppingListItem, qty: number) => void;
  onRemove: (id: string) => void;
  pendingQuantityIds: Set<string>;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.shoppingRow, { borderColor: colors.border }]}>
      <Pressable
        style={styles.shoppingCheck}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selectionMode ? selected : item.checked }}
      >
        <Ionicons
          name={(selectionMode ? selected : item.checked) ? "checkbox" : "square-outline"}
          size={20}
          color={
            selectionMode
              ? selected
                ? colors.danger
                : colors.textMuted
              : item.checked
                ? colors.primary
                : colors.textMuted
          }
        />
        <View style={styles.shoppingTextColumn}>
          <Text
            style={[
              styles.shoppingLabel,
              {
                color: item.checked ? colors.textMuted : colors.text,
                textDecorationLine: item.checked ? "line-through" : "none",
              },
            ]}
          >
            {item.name}
          </Text>
          {item.addedBy ? (
            <Text style={[styles.shoppingAddedBy, { color: colors.textMuted }]}>
              Added by {item.addedBy}
            </Text>
          ) : null}
        </View>
      </Pressable>
      {!selectionMode ? (
        <View style={styles.shoppingActions}>
          <View style={styles.quantityStepper}>
            <Pressable
              onPress={() => onChangeQuantity(item, item.qty - 1)}
              disabled={item.qty <= 1 || pendingQuantityIds.has(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Decrease quantity of ${item.name}`}
            >
              <Ionicons
                name="remove-circle-outline"
                size={20}
                color={item.qty <= 1 ? colors.border : colors.primary}
              />
            </Pressable>
            <Text style={[styles.quantityValue, { color: colors.text }]}>{item.qty}</Text>
            <Pressable
              onPress={() => onChangeQuantity(item, item.qty + 1)}
              disabled={pendingQuantityIds.has(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Increase quantity of ${item.name}`}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => onRemove(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name} from shopping list`}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

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
    updateQuantity,
    pendingQuantityIds,
    removeItem,
    clearChecked,
    removeItems,
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
  const [sendingTest, setSendingTest] = useState(false);
  const [clearedItems, setClearedItems] = useState<ShoppingListItem[] | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleCopyLink = async (token: string) => {
    await Clipboard.setStringAsync(inviteLink(token));
  };

  const handleAddShoppingItem = async () => {
    const name = newItem.trim();
    if (!name) return;
    const existing = findMatchingUnchecked(shoppingItems, name);
    if (existing) {
      await handleChangeQuantity(existing, existing.qty + 1);
    } else {
      await addItem({ name, qty: 1 });
    }
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
  const groupedShoppingItems = useMemo(
    () => groupShoppingListByCategory(shoppingItems),
    [shoppingItems]
  );

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
      await Promise.all(toRestore.map((item) => addItem({ name: item.name, qty: item.qty })));
    } catch (err) {
      Alert.alert(
        "Couldn't restore items",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const handleChangeQuantity = async (item: ShoppingListItem, nextQty: number) => {
    if (nextQty < 1) return;
    try {
      await updateQuantity(item.id, nextQty);
    } catch (err) {
      Alert.alert(
        "Couldn't update quantity",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const handleShareList = async () => {
    try {
      await Share.share({ message: formatShoppingListForShare(shoppingItems) });
    } catch (err) {
      Alert.alert(
        "Couldn't share the list",
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

  const handleEnterSelectionMode = () => {
    setSelectedIds(new Set());
    setSelectionMode(true);
  };

  const handleExitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleToggleItemSelected = (id: string) => {
    setSelectedIds((prev) => toggleSelection(prev, id));
  };

  const handleToggleSelectAllForDeletion = () => {
    setSelectedIds((prev) => toggleSelectAll(shoppingItems.map((item) => item.id), prev));
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count === 0) return;
    confirmDestructiveAction({
      title: "Delete items",
      message: `Remove ${count} item${count === 1 ? "" : "s"} from your shopping list?`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          const removed = await removeItems(Array.from(selectedIds));
          if (removed.length > 0) {
            setClearedItems(removed);
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
            undoTimerRef.current = setTimeout(() => setClearedItems(null), 5000);
          }
          handleExitSelectionMode();
        } catch (err) {
          Alert.alert(
            "Couldn't delete items",
            err instanceof Error ? err.message : "Something went wrong. Please try again."
          );
        }
      },
    });
  };

  const handleSendTestNotification = async () => {
    setSendingTest(true);
    try {
      const result = await sendTestNotification();
      if (result.ok) {
        Alert.alert("Test notification sent", "Check your notification shade.");
      } else {
        Alert.alert("Couldn't send it", result.reason);
      }
    } catch (err) {
      Alert.alert(
        "Couldn't send it",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <Screen avoidKeyboard>
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
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <CardHeader
            title="Pending invites"
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
                    {invite.contact_type !== "link" ? ` · ${invite.contact}` : ""}
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
                selectionMode ? (
                  <CardHeaderLink label="Cancel" onPress={handleExitSelectionMode} />
                ) : (
                  <View style={styles.cardHeaderActions}>
                    <Pressable
                      onPress={handleShareList}
                      accessibilityRole="button"
                      accessibilityLabel="Share shopping list"
                    >
                      <Ionicons name="share-outline" size={18} color={colors.primary} />
                    </Pressable>
                    <Pressable
                      onPress={handleEnterSelectionMode}
                      accessibilityRole="button"
                      accessibilityLabel="Select items to delete"
                    >
                      <Ionicons name="checkbox-outline" size={18} color={colors.primary} />
                    </Pressable>
                  </View>
                )
              ) : undefined
            }
          />
          {!selectionMode && shoppingItems.length > 0 ? (
            <View style={styles.shoppingToolbar}>
              <CardHeaderLink
                label={allChecked ? "Deselect all" : "Select all"}
                onPress={handleToggleSelectAll}
              />
              {checkedCount > 0 ? (
                <CardHeaderLink label="Clear checked" onPress={handleClearChecked} />
              ) : null}
            </View>
          ) : null}
          {selectionMode ? (
            <View style={[styles.selectionToolbar, { borderColor: colors.border }]}>
              <Text style={[styles.selectionCount, { color: colors.textMuted }]}>
                {selectedIds.size} selected
              </Text>
              <View style={styles.cardHeaderActions}>
                <CardHeaderLink
                  label={
                    selectedIds.size === shoppingItems.length && shoppingItems.length > 0
                      ? "Select none"
                      : "Select all"
                  }
                  onPress={handleToggleSelectAllForDeletion}
                />
                {selectedIds.size > 0 ? (
                  <CardHeaderLink
                    label={`Delete (${selectedIds.size})`}
                    tone="danger"
                    onPress={handleDeleteSelected}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
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
            groupedShoppingItems.map(({ category, items }) => (
              <View key={category}>
                <Text style={[styles.shoppingCategoryLabel, { color: colors.textMuted }]}>
                  {category}
                </Text>
                {items.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    selectionMode={selectionMode}
                    selected={selectedIds.has(item.id)}
                    onToggle={() => {
                      hapticTap();
                      selectionMode
                        ? handleToggleItemSelected(item.id)
                        : toggleChecked(item.id, !item.checked);
                    }}
                    onChangeQuantity={handleChangeQuantity}
                    onRemove={removeItem}
                    pendingQuantityIds={pendingQuantityIds}
                  />
                ))}
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
          <CardHeader
            title="Donate surplus"
            action={
              totalItemsDonated > 0 ? (
                <CardHeaderLink
                  label="View history"
                  onPress={() => navigation.navigate("DonationHistory")}
                />
              ) : undefined
            }
          />
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
          {__DEV__ ? (
            <Button
              label={sendingTest ? "Sending…" : "Send test notification"}
              variant="outline"
              onPress={handleSendTestNotification}
              loading={sendingTest}
              style={styles.testNotificationButton}
            />
          ) : null}
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
    alignItems: "center",
    gap: spacing.md,
  },
  shoppingToolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  selectionToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  selectionCount: {
    ...typography.caption,
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
  shoppingCategoryLabel: {
    ...typography.label,
    marginTop: spacing.md,
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
  shoppingTextColumn: {
    flexShrink: 1,
  },
  shoppingLabel: {
    ...typography.body,
    flexShrink: 1,
  },
  shoppingAddedBy: {
    ...typography.caption,
  },
  shoppingActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  quantityStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  quantityValue: {
    ...typography.bodyMedium,
    minWidth: 18,
    textAlign: "center",
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
  testNotificationButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
  donateButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
});
