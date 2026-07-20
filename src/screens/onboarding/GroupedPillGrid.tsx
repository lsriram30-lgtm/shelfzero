import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pill } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { spacing, typography } from "../../theme";

export interface PillGroup {
  label: string;
  options: string[];
}

interface GroupedPillGridProps {
  groups: PillGroup[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function GroupedPillGrid({ groups, selected, onToggle }: GroupedPillGridProps) {
  const { colors } = useTheme();

  return (
    <View>
      {groups.map((group) => (
        <View key={group.label} style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{group.label}</Text>
          <View style={styles.wrap}>
            {group.options.map((option) => (
              <Pill
                key={option}
                label={option}
                selected={selected.includes(option)}
                onPress={() => onToggle(option)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
