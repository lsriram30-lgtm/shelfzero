import React, { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { Screen, Header, Card, EmptyState, ErrorState, Pill, Button, TextField } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { PantryStackParamList } from "../../navigation/types";
import { PantryItem } from "../../types";
import { groupByCategory, sortByExpiry, daysUntil, filterByName } from "./pantryLogic";

type PantryNavigationProp = NativeStackNavigationProp<PantryStackParamList, "Pantry">;
type SortMode = "category" | "expiry";

function ExpiryTag({ expiresAt }: { expiresAt: string | null }) {
  const { colors } = useTheme();
  const days = daysUntil(expiresAt);
  if (days === null) return null;

  const tone = days <= 3 ? colors.danger : days <= 7 ? colors.warning : colors.textMuted;
  const label = days < 0 ? "Expired" : days === 0 ? "Expires today" : `${days}d left`;

  return <Text style={[styles.expiryTag, { color: tone }]}>{label}</Text>;
}

function PantryRow({
  item,
  onPress,
  first,
}: {
  item: PantryItem;
  onPress: () => void;
  first?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[styles.row, { borderColor: colors.border }, first ? styles.rowNoBorder : null]}
      onPress={onPress}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <View style={styles.rowEnd}>
        <ExpiryTag expiresAt={item.expiresAt} />
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

function CategoryGroup({
  category,
  items,
  expanded,
  onToggle,
  onSelectItem,
}: {
  category: string;
  items: PantryItem[];
  expanded: boolean;
  onToggle: () => void;
  onSelectItem: (item: PantryItem) => void;
}) {
  const { colors } = useTheme();
  return (
    <Card style={styles.groupCard}>
      <Pressable style={styles.groupHeader} onPress={onToggle}>
        <Text style={[styles.groupTitle, { color: colors.text }]}>
          {category} <Text style={{ color: colors.textMuted }}>({items.length})</Text>
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
      {expanded ? (
        <View>
          {items.map((item) => (
            <PantryRow key={item.id} item={item} onPress={() => onSelectItem(item)} />
          ))}
        </View>
      ) : null}
    </Card>
  );
}

export function PantryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<PantryNavigationProp>();
  const { items, loading, error, isOffline, refresh } = usePantry();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>("category");
  const [query, setQuery] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filteredItems = useMemo(() => filterByName(items, query), [items, query]);
  const grouped = useMemo(() => groupByCategory(filteredItems), [filteredItems]);
  const categories = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const byExpiry = useMemo(() => sortByExpiry(filteredItems), [filteredItems]);

  const expiringSoon = useMemo(
    () => items.filter((item) => {
      const days = daysUntil(item.expiresAt);
      return days !== null && days <= 3;
    }),
    [items]
  );

  const toggleCategory = (category: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <Screen>
      <Header
        title="Pantry"
        subtitle={`${items.length} item${items.length === 1 ? "" : "s"}`}
        right={
          <Pressable
            onPress={() => navigation.navigate("PantryStats")}
            style={[styles.statsButton, { borderColor: colors.border }]}
          >
            <Ionicons name="stats-chart-outline" size={16} color={colors.text} />
            <Text style={[styles.statsButtonLabel, { color: colors.text }]}>Stats</Text>
          </Pressable>
        }
      />

      <View style={styles.actionsRow}>
        <Button
          label="Add item"
          icon={<Ionicons name="add" size={18} color={colors.surface} />}
          onPress={() => navigation.navigate("AddPantryItem")}
          style={styles.actionButton}
        />
        <Button
          label="Scan"
          variant="neutral"
          icon={<Ionicons name="camera-outline" size={18} color={colors.text} />}
          onPress={() => navigation.navigate("Scan")}
          style={styles.actionButton}
        />
      </View>

      {isOffline ? (
        <View style={styles.bannerWrapper}>
          <Pill label="Showing last synced data — couldn't reach the server" tone="warning" />
        </View>
      ) : null}

      {expiringSoon.length > 0 ? (
        <View style={styles.bannerWrapper}>
          <Pill
            label={`${expiringSoon.length} item${expiringSoon.length === 1 ? "" : "s"} expiring within 3 days`}
            tone="warning"
          />
        </View>
      ) : null}

      {items.length > 0 ? (
        <View style={styles.searchWrapper}>
          <TextField
            placeholder="Search pantry"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      ) : null}

      {items.length > 0 ? (
        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: colors.textMuted }]}>Sort by</Text>
          <Pill
            label="Category"
            selected={sortMode === "category"}
            onPress={() => setSortMode("category")}
          />
          <Pill
            label="Expiry date"
            selected={sortMode === "expiry"}
            onPress={() => setSortMode("expiry")}
          />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        {error && items.length === 0 && !loading ? (
          <ErrorState onRetry={refresh} />
        ) : items.length === 0 && !loading ? (
          <EmptyState
            title="Your pantry is empty"
            message="Add items manually or scan a receipt to get started."
            actionLabel="Add an item"
            onAction={() => navigation.navigate("AddPantryItem")}
          />
        ) : categories.length === 0 && !loading ? (
          <EmptyState title="No matching items" message={`Nothing matches "${query.trim()}".`} />
        ) : sortMode === "expiry" ? (
          <Card style={styles.groupCard}>
            {byExpiry.map((item, index) => (
              <PantryRow
                key={item.id}
                item={item}
                first={index === 0}
                onPress={() => navigation.navigate("AddPantryItem", { item })}
              />
            ))}
          </Card>
        ) : (
          categories.map((category) => (
            <CategoryGroup
              key={category}
              category={category}
              items={grouped[category]}
              expanded={!collapsed.has(category)}
              onToggle={() => toggleCategory(category)}
              onSelectItem={(item) => navigation.navigate("AddPantryItem", { item })}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statsButtonLabel: {
    ...typography.label,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  bannerWrapper: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  searchWrapper: {
    paddingHorizontal: spacing.xl,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sortLabel: {
    ...typography.caption,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  groupCard: {
    padding: 0,
    overflow: "hidden",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  groupTitle: {
    ...typography.h3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  rowNoBorder: {
    borderTopWidth: 0,
  },
  rowMain: {
    flexShrink: 1,
  },
  rowEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowTitle: {
    ...typography.bodyMedium,
  },
  rowMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  expiryTag: {
    ...typography.caption,
  },
});
