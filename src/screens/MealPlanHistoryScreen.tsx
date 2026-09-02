import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Screen, Header, Card, EmptyState } from "../components";
import { spacing, typography } from "../theme";
import { getMealPlanHistory, MealPlanHistoryEntry } from "../utils/mealPlanCache";

export function MealPlanHistoryScreen() {
  const { colors } = useTheme();
  const { currentEmail } = useAuth();
  const [history, setHistory] = useState<MealPlanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getMealPlanHistory(currentEmail).then((entries) => {
      setHistory(entries);
      setLoading(false);
    });
  }, [currentEmail]);

  if (loading) {
    return (
      <Screen>
        <Header title="Meal plan history" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Meal plan history" subtitle="Past weeks you've generated" />
      {history.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No history yet"
          message="Once you've built up a full week, it's saved here so you can look back."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {history.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <Card key={entry.id} style={styles.card}>
                <Pressable
                  style={styles.header}
                  onPress={() => setExpandedId(expanded ? null : entry.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  accessibilityLabel={`Meal plan generated ${new Date(
                    entry.savedAt
                  ).toLocaleDateString()}`}
                >
                  <View style={styles.headerText}>
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {new Date(entry.savedAt).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={[styles.summaryText, { color: colors.textMuted }]}>
                      {entry.days.length} day{entry.days.length === 1 ? "" : "s"}
                    </Text>
                  </View>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
                {expanded ? (
                  <View style={styles.dayList}>
                    {entry.days.map((day) => (
                      <View key={day.day} style={styles.dayBlock}>
                        <Text style={[styles.dayLabel, { color: colors.text }]}>{day.day}</Text>
                        {day.meals.map((meal, index) => (
                          <Text key={index} style={[styles.mealText, { color: colors.textMuted }]}>
                            {meal.label}: {meal.title}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                ) : null}
              </Card>
            );
          })}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    flexShrink: 1,
  },
  dateText: {
    ...typography.bodyMedium,
  },
  summaryText: {
    ...typography.caption,
    marginTop: spacing.xs / 2,
  },
  dayList: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  dayBlock: {},
  dayLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  mealText: {
    ...typography.body,
    marginBottom: spacing.xs / 2,
  },
});
