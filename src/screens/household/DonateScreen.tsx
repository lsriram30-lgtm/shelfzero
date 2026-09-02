import React, { useMemo, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { useDonations } from "../../context/DonationContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { Screen, Header, Card, Button, EmptyState } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { DonationPartner } from "../../types";
import { feedingAmericaUrl, foodPantriesUrl, mapsSearchUrl, parseLocationHint } from "./donateLocationLinks";

const DAY_MS = 24 * 60 * 60 * 1000;
const DONATION_WINDOW_DAYS = 7;

// Not real partners - there's no backend integration to notify or confirm
// with an actual organization (see TASKS.md). These are honest, general
// suggestions for finding somewhere nearby to donate to; the user reaches
// out and confirms it themselves. Feeding America, FoodPantries.org, and
// the maps search all take the onboarding location and link straight to
// real, location-scoped results (see donateLocationLinks.ts for what's
// actually verified to work) instead of each partner's bare homepage.
// AmpleHarvest's search is AJAX-only and 211 has no unified national
// search, so those two stay as plain links.
function buildDonationPartners(locationText: string): DonationPartner[] {
  const hint = parseLocationHint(locationText);
  const hasHint = !!(hint.zip || hint.stateAbbr);
  const near = hint.zip ?? hint.stateAbbr;

  return [
    {
      id: "feeding-america",
      name: "Feeding America",
      description: hasHint
        ? `Nationwide food bank network, already searched near ${near}`
        : "Search their nationwide network of food banks by zip code",
      url: feedingAmericaUrl(hint),
      accepts:
        "Varies by the specific food bank, but unopened, unexpired canned/boxed goods are almost always accepted; fresh, frozen, or refrigerated items depend on the location.",
    },
    {
      id: "ampleharvest",
      name: "AmpleHarvest.org",
      description: "Matches surplus pantry or garden food with a nearby pantry that can use it",
      url: "https://www.ampleharvest.org/find-pantry/",
      accepts: "Built specifically for fresh produce and garden surplus, not packaged goods.",
    },
    {
      id: "211",
      name: "211",
      description: "Free community-services directory, including food assistance near you",
      url: "https://www.211.org/",
      accepts: "A general directory, not food-specific — ask what's accepted when you call.",
    },
    {
      id: "foodpantries",
      name: "FoodPantries.org",
      description: hasHint
        ? `Food pantry directory, already searched near ${near}`
        : "Directory of food pantries searchable by city, state, or zip code",
      url: foodPantriesUrl(hint),
      accepts: "Varies by pantry — most list accepted items and hours on their own page.",
    },
    {
      id: "maps-search",
      name: "Search maps for food banks",
      description: locationText.trim()
        ? `Opens your maps app searching for food banks near ${locationText.trim()}`
        : "Opens your maps app with a search for nearby food banks",
      url: mapsSearchUrl(locationText),
      accepts: "Varies completely by location — check with them directly before dropping off.",
    },
  ];
}

export function DonateScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { items, removeItem } = usePantry();
  const { recordDonation } = useDonations();
  const { profile } = useOnboarding();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ count: number; partnerName: string; partnerUrl?: string } | null>(
    null
  );

  const donationPartners = useMemo(
    () => buildDonationPartners(profile?.location ?? ""),
    [profile?.location]
  );

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
  const partner = donationPartners.find((p) => p.id === partnerId);
  const canConfirm = selectedItems.length > 0 && !!partner && !submitting;

  const handleConfirm = async () => {
    if (!partner) return;
    setSubmitting(true);
    // Removed one at a time so a mid-batch failure still leaves us knowing
    // exactly which items are actually gone from the pantry (for real,
    // regardless of what happens next) vs. which never got touched.
    const removed: typeof selectedItems = [];
    try {
      for (const item of selectedItems) {
        await removeItem(item.id);
        removed.push(item);
      }
      await recordDonation({
        partnerId: partner.id,
        partnerName: partner.name,
        itemNames: removed.map((item) => item.name),
      });
      setDone({ count: removed.length, partnerName: partner.name, partnerUrl: partner.url });
    } catch (err) {
      if (removed.length > 0) {
        // These items are genuinely gone from the pantry already - log them
        // as donated (best-effort) so that removal isn't left unaccounted
        // for in history, even though the batch didn't fully complete.
        await recordDonation({
          partnerId: partner.id,
          partnerName: partner.name,
          itemNames: removed.map((item) => item.name),
        }).catch(() => {});
      }
      Alert.alert(
        "Couldn't complete donation",
        removed.length > 0
          ? `${removed.length} of ${selectedItems.length} items were removed from your pantry ` +
            `and logged as donated before this failed. The rest are unchanged — you can try ` +
            `again with what's left.`
          : err instanceof Error
            ? err.message
            : "Please try again."
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
              {done.count} item{done.count === 1 ? "" : "s"} logged for {done.partnerName}. Nothing's
              actually there yet — open their site to find a location and drop them off.
            </Text>
            {done.partnerUrl ? (
              <Button
                label={`Open ${done.partnerName}`}
                onPress={() => Linking.openURL(done.partnerUrl!)}
                style={styles.doneButton}
              />
            ) : null}
            <Button
              label="Done"
              variant={done.partnerUrl ? "secondary" : "primary"}
              onPress={() => navigation.goBack()}
              style={styles.doneButton}
            />
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Donate surplus" subtitle="Find somewhere nearby to send items nearing expiry" />
      <ScrollView contentContainerStyle={styles.content}>
        {candidates.length === 0 ? (
          <EmptyState
            icon="heart-outline"
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
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={item.name}
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
              FIND A PLACE TO DONATE
            </Text>
            <View style={styles.partnerList}>
              {donationPartners.map((p) => {
                const selected = partnerId === p.id;
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.partnerRow,
                      {
                        borderColor: selected ? colors.primary : colors.border,
                        backgroundColor: colors.surface,
                      },
                    ]}
                  >
                    <Pressable
                      onPress={() => setPartnerId(p.id)}
                      style={styles.partnerSelectArea}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={
                        p.accepts ? `${p.name}. Accepts: ${p.accepts}` : p.name
                      }
                    >
                      <View style={styles.partnerInfo}>
                        <Text style={[styles.partnerName, { color: colors.text }]}>{p.name}</Text>
                        <Text style={[styles.partnerDescription, { color: colors.textMuted }]}>
                          {p.description}
                        </Text>
                        {p.accepts ? (
                          <Text style={[styles.partnerAccepts, { color: colors.textMuted }]}>
                            Accepts: {p.accepts}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons
                        name={selected ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={selected ? colors.primary : colors.textMuted}
                      />
                    </Pressable>
                    {p.url ? (
                      <Pressable
                        onPress={() => Linking.openURL(p.url!)}
                        hitSlop={8}
                        style={styles.partnerLinkButton}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${p.name}`}
                      >
                        <Ionicons name="open-outline" size={18} color={colors.primary} />
                      </Pressable>
                    ) : null}
                  </View>
                );
              })}
            </View>
            <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
              These are suggestions to help you find somewhere to donate — reach out and confirm
              with them yourself. Selecting one just labels this donation in your history;
              ShelfZero doesn't contact anyone on your behalf.
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
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  partnerSelectArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partnerLinkButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
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
  partnerAccepts: {
    ...typography.caption,
    marginTop: 2,
    fontStyle: "italic",
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
