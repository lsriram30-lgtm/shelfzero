import React from "react";
import { StyleSheet, View } from "react-native";
import { Pill } from "../../components";
import { spacing } from "../../theme";

interface PillGridProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function PillGrid({ options, selected, onToggle }: PillGridProps) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => (
        <Pill
          key={option}
          label={option}
          selected={selected.includes(option)}
          onPress={() => onToggle(option)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
