import React, { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useSuggestedRecipes } from "../../hooks/useSuggestedRecipes";
import { favoritesApi } from "../../api/favorites";
import { Screen, Header, Card, EmptyState, ErrorState, Pill } from "../../components";
import { spacing, typography } from "../../theme";
import { RecipesStackParamList } from "../../navigation/types";
import { Recipe } from "../../types";
import { filterByMealType, uniqueMealTypes } from "./recipesLogic";

type RecipesNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "Recipes">;

function RecipeTile({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <Card style={styles.tileCard}>
        {recipe.isFavorite ? (
          <Ionicons
            name="star"
            size={16}
            color={colors.accent}
            style={styles.favoriteIcon}
          />
        ) : null}
        <Text style={[styles.tileTitle, { color: colors.text }]} numberOfLines={2}>
          {recipe.title}
        </Text>
        {typeof recipe.matchScore === "number" ? (
          <Text style={[styles.matchScore, { color: colors.primary }]}>
            {recipe.matchScore}% match
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

export function RecipesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<RecipesNavigationProp>();
  const { recipes, loading, error, generate } = useSuggestedRecipes();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [mealTypeFilter, setMealTypeFilter] = useState<string | null>(null);

  const loadFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const data = await favoritesApi.list();
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as { items?: Recipe[] })?.items)
        ? (data as { items: Recipe[] }).items
        : [];
      setFavorites(list);
    } catch {
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    generate();
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const favoriteIds = new Set(favorites.map((f) => f.id));
  const combined = [
    ...favorites,
    ...recipes.filter((r) => !favoriteIds.has(r.id)),
  ];
  const mealTypes = uniqueMealTypes(combined);
  const filtered = filterByMealType(combined, mealTypeFilter);

  return (
    <Screen>
      <Header title="Recipes" subtitle="Suggested from what's in your pantry" />
      {mealTypes.length > 0 ? (
        <View style={styles.filterRow}>
          <Pill
            label="All"
            selected={mealTypeFilter === null}
            onPress={() => setMealTypeFilter(null)}
          />
          {mealTypes.map((mealType) => (
            <Pill
              key={mealType}
              label={mealType}
              selected={mealTypeFilter === mealType}
              onPress={() => setMealTypeFilter(mealType)}
            />
          ))}
        </View>
      ) : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.column}
        refreshControl={
          <RefreshControl
            refreshing={loading || favoritesLoading}
            onRefresh={() => {
              generate();
              loadFavorites();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? (
            error ? (
              <ErrorState
                message={error}
                onRetry={() => {
                  generate();
                  loadFavorites();
                }}
              />
            ) : combined.length > 0 ? (
              <EmptyState
                title="No matching recipes"
                message={`No ${mealTypeFilter} recipes right now — try a different filter.`}
              />
            ) : (
              <EmptyState
                title="No recipes yet"
                message="Add a few pantry items and pull to refresh to get suggestions."
              />
            )
          ) : null
        }
        renderItem={({ item }) => (
          <RecipeTile
            recipe={{ ...item, isFavorite: favoriteIds.has(item.id) }}
            onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  column: {
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  tileCard: {
    minHeight: 120,
    justifyContent: "flex-end",
  },
  favoriteIcon: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  tileTitle: {
    ...typography.bodyMedium,
  },
  matchScore: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
