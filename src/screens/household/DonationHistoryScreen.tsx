import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useDonations } from "../../context/DonationContext";
import { Screen, Header, Card, EmptyState } from "../../components";
import { spacing, typography } from "../../theme";

export function DonationHistoryScreen() {
  const { colors } = useTheme();
  const { history, isLoading, refresh } = useDonations();

  // Donations are shared across the household - another member's donation
  // needs to show up here without an app restart, the same pattern already
  // used by Pantry/Recipes for the same reason.
  useFocusEffect(
    React.useCallback(() => {
      refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return (
    <Screen>
      <Header title="Donation history" subtitle="Everything your household has donated" />
      {!isLoading && history.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        >
          <EmptyState
            icon="heart-outline"
            title="No donations yet"
            message="Items you donate will show up here, along with who they went to and when."
          />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        >
          {history.map((record) => (
            <Card key={record.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={[styles.partner, { color: colors.text }]}>{record.partnerName}</Text>
                <Text style={[styles.date, { color: colors.textMuted }]}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.items, { color: colors.textMuted }]}>
                {record.itemNames.join(", ")}
              </Text>
            </Card>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  partner: {
    ...typography.bodyMedium,
  },
  date: {
    ...typography.caption,
  },
  items: {
    ...typography.body,
  },
});
