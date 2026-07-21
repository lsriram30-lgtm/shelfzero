import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { useDonations } from "../../context/DonationContext";
import { Screen, Header, Card, Button, EmptyState } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { DonationPartner } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const DONATION_WINDOW_DAYS = 7;

const DONATION_PARTNERS: DonationPartner[] = [
  {
    id: "food-pantry",
    name: "Community Food Pantry",
    description: "General pantry staples and shelf-stable goods",
  },
  {
    id: "shelter",
    name: "Neighborhood Shelter",
    description: "Prepared meals and fresh produce",
  },
  {
    id: "fridge",
    name: "Community Fridge",
    description: "Self-serve drop-off, no appointment needed",
  },
];

export function DonateScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { items, removeItem } = usePantry();
  const { recordDonation } = useDonations();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ count: number; partnerName: string } | null>(null);

  const candidates = useMemo(() => {
    const now = Date.now();
    return items
      .filter((item) => {
        if (!item.expiresAt) return false;
        const daysLeft = Math.ceil((new Date(item.expiresAt).getTime() - now) / DAY_MS);
        return daysLeft >= 0 && daysLeft <= DONATION_WINDOW_DAYS;
      })
      .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
  }, [items]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = candidates.filter((item) => selectedIds.has(item.id));
  const partner = DONATION_PARTNERS.find((p) => p.id === partnerId);
  const canConfirm = selectedItems.length > 0 && !!partner && !submitting;

  const handleConfirm = async () => {
    if (!partner) return;
    setSubmitting(true);
    try {
      for (const item of selectedItems) {
        await removeItem(item.id);
      }
      await recordDonation({
        partnerId: partner.id,
        partnerName: partner.name,
        itemNames: selectedItems.map((item) => item.name),
      });
      setDone({ count: selectedItems.length, partnerName: partner.name });
    } catch (err) {
      Alert.alert(
        "Couldn't complete donation",
        err instanceof Error ? err.message : "Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Screen>
        <Header title="Donate surplus" />
        <View style={styles.doneWrapper}>
          <Card style={styles.doneCard}>
            <Text style={[styles.doneTitle, { color: colors.text }]}>Thank you!</Text>
            <Text style={[styles.doneMessage, { color: colors.textMuted }]}>
              {done.count} item{done.count === 1 ? "" : "s"} donated to {done.partnerName}.
            </Text>
            <Button label="Done" onPress={() => navigation.goBack()} style={styles.doneButton} />
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Donate surplus" subtitle="Send items nearing expiry to a local partner" />
      <ScrollView contentContainerStyle={styles.content}>
        {candidates.length === 0 ? (
          <EmptyState
            title="Nothing to donate right now"
            message={`Items expiring within ${DONATION_WINDOW_DAYS} days will show up here.`}
          />
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SELECT ITEMS</Text>
            <Card style={styles.itemsCard}>
              {candidates.map((item) => {
                const selected = selectedIds.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.itemRow, { borderColor: colors.border }]}
                    onPress={() => toggleSelected(item.id)}
                  >
                    <Ionicons
                      name={selected ? "checkbox" : "square-outline"}
                      size={20}
                      color={selected ? colors.primary : colors.textMuted}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                        {item.quantity} {item.unit} · expires{" "}
                        {new Date(item.expiresAt!).toLocaleDateString()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </Card>

            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              CHOOSE A PARTNER
            </Text>
            <View style={styles.partnerList}>
              {DONATION_PARTNERS.map((p) => {
                const selected = partnerId === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setPartnerId(p.id)}
                    style={[
                      styles.partnerRow,
                      {
                        borderColor: selected ? colors.primary : colors.border,
                        backgroundColor: colors.surface,
                      },
                    ]}
                  >
                    <View style={styles.partnerInfo}>
                      <Text style={[styles.partnerName, { color: colors.text }]}>{p.name}</Text>
                      <Text style={[styles.partnerDescription, { color: colors.textMuted }]}>
                        {p.description}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={selected ? colors.primary : colors.textMuted}
                    />
                  </Pressable>
                );
              })}
            </View>
            <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
              These are placeholder partners for now — real local organizations can be connected
              here once the backend supports it.
            </Text>

            <Button
              label={
                submitting
                  ? "Donating…"
                  : `Donate ${selectedItems.length || ""} item${
                      selectedItems.length === 1 ? "" : "s"
                    }`
              }
              onPress={handleConfirm}
              disabled={!canConfirm}
              loading={submitting}
              style={styles.confirmButton}
            />
          </>
        )}
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
  sectionLabel: {
    ...typography.label,
  },
  itemsCard: {},
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  itemInfo: {
    flexShrink: 1,
  },
  itemName: {
    ...typography.bodyMedium,
  },
  itemMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  partnerList: {
    gap: spacing.sm,
  },
  partnerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  partnerInfo: {
    flexShrink: 1,
  },
  partnerName: {
    ...typography.bodyMedium,
  },
  partnerDescription: {
    ...typography.caption,
    marginTop: 2,
  },
  disclaimer: {
    ...typography.caption,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
  doneWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  doneCard: {
    alignItems: "center",
  },
  doneTitle: {
    ...typography.h2,
  },
  doneMessage: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  doneButton: {
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
});
