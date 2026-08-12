import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { favoritesApi } from "../../api/favorites";
import { Screen, Header, Card, Button } from "../../components";
import { spacing, typography } from "../../theme";
import { RecipesStackParamList } from "../../navigation/types";

type DetailRouteProp = RouteProp<RecipesStackParamList, "RecipeDetail">;

export function RecipeDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute<DetailRouteProp>();
  const { recipe } = route.params;

  const [servings, setServings] = useState(recipe.servings ?? 2);
  const [isFavorite, setIsFavorite] = useState(!!recipe.isFavorite);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    if (isFavorite) return;
    setSavingFavorite(true);
    try {
      await favoritesApi.add(recipe.id);
      setIsFavorite(true);
    } catch (err) {
      Alert.alert(
        "Couldn't add to favorites",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSavingFavorite(false);
    }
  };

  return (
    <Screen>
      <Header title={recipe.title} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.servingsCard}>
          <Text style={[styles.servingsLabel, { color: colors.textMuted }]}>Servings</Text>
          <View style={styles.stepper}>
            <Button
              label="−"
              variant="outline"
              onPress={() => setServings((s) => Math.max(1, s - 1))}
              style={styles.stepperButton}
            />
            <Text style={[styles.servingsValue, { color: colors.text }]}>{servings}</Text>
            <Button
              label="+"
              variant="outline"
              onPress={() => setServings((s) => Math.min(20, s + 1))}
              style={styles.stepperButton}
            />
          </View>
          <Text style={[styles.servingsHint, { color: colors.textMuted }]}>
            A planning note only — ingredient amounts below aren't scaled to this yet.
          </Text>
        </Card>

        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                • {ingredient}
              </Text>
            ))}
          </Card>
        ) : null}

        {recipe.steps && recipe.steps.length > 0 ? (
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Steps</Text>
            {recipe.steps.map((step, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.text }]}>
                {index + 1}. {step}
              </Text>
            ))}
          </Card>
        ) : null}

        <Button
          label={isFavorite ? "Favorited" : savingFavorite ? "Saving…" : "Add to favorites"}
          variant={isFavorite ? "secondary" : "outline"}
          onPress={handleToggleFavorite}
          disabled={isFavorite || savingFavorite}
          style={styles.favoriteButton}
        />
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
  servingsCard: {
    alignItems: "center",
  },
  servingsLabel: {
    ...typography.label,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  stepperButton: {
    width: 48,
    paddingHorizontal: 0,
  },
  servingsValue: {
    ...typography.h1,
    minWidth: 40,
    textAlign: "center",
  },
  servingsHint: {
    ...typography.caption,
    marginTop: spacing.md,
    textAlign: "center",
  },
  card: {},
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  listItem: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  favoriteButton: {
    marginTop: spacing.sm,
  },
});
