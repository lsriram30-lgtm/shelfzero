import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { readableTextColor, typography } from "../theme";

const ACTION_WIDTH = 84;

export function SwipeToDelete({
  onDelete,
  accessibilityLabel,
  children,
}: {
  onDelete: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const actionTextColor = readableTextColor(colors.danger);

  const handlePress = () => {
    swipeableRef.current?.close();
    onDelete();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [ACTION_WIDTH, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View style={[styles.actionContainer, { transform: [{ translateX }] }]}>
        <Pressable
          style={[styles.action, { backgroundColor: colors.danger }]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          <Ionicons name="trash-outline" size={20} color={actionTextColor} />
          <Text style={[styles.actionLabel, { color: actionTextColor }]}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    width: ACTION_WIDTH,
  },
  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  actionLabel: {
    ...typography.label,
  },
});
