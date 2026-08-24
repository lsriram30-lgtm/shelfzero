import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useSuggestedRecipes } from "../../hooks/useSuggestedRecipes";
import { favoritesApi } from "../../api/favorites";
import { recipesApi } from "../../api/recipes";
import {
  Screen,
  Header,
  Card,
  Button,
  EmptyState,
  ErrorState,
  Pill,
  TextField,
  Skeleton,
} from "../../components";
import { spacing, typography } from "../../theme";
import { RecipesStackParamList } from "../../navigation/types";
import { Recipe } from "../../types";
import {
  buildRecipesEmptyMessage,
  filterByCuisine,
  filterByMealType,
  filterByTitle,
  sortByMatchScore,
  uniqueCuisines,
  uniqueMealTypes,
} from "./recipesLogic";

type RecipesNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "Recipes">;

function RecipeTile({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const { colors } = useTheme();
  const label = [recipe.title, recipe.cuisine, recipe.isFavorite ? "favorited" : null]
    .filter(Boolean)
    .join(", ");
  return (
    <Pressable
      style={styles.tile}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Card style={styles.tileCard}>
        {recipe.isFavorite ? (
          <Ionicons
            name="star"
            size={16}
            color={colors.primary}
            style={styles.favoriteIcon}
          />
        ) : null}
        <Text style={[styles.tileTitle, { color: colors.text }]} numberOfLines={2}>
          {recipe.title}
        </Text>
        {recipe.cuisine ? (
          <Text style={[styles.tileCuisine, { color: colors.textMuted }]} numberOfLines={1}>
            {recipe.cuisine}
          </Text>
        ) : null}
        {typeof recipe.matchScore === "number" ? (
          <View style={styles.matchScoreWrapper}>
            <Pill label={`${recipe.matchScore}% match`} tone="highlight" />
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

function RecipeTileSkeleton() {
  return (
    <View style={styles.tile}>
      <Card style={styles.tileCard}>
        <Skeleton width="90%" height={14} style={{ marginBottom: spacing.xs }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="45%" height={11} />
      </Card>
    </View>
  );
}

function RecipesSkeleton() {
  return (
    <View style={styles.grid}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.skeletonRow}>
          <RecipeTileSkeleton />
          <RecipeTileSkeleton />
        </View>
      ))}
    </View>
  );
}

export function RecipesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<RecipesNavigationProp>();
  const { recipes, loading, error, generate } = useSuggestedRecipes();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [mealTypeFilter, setMealTypeFilter] = useState<string | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // Real search hits a slow (up to several seconds), Gemini-backed
  // catalog search - deliberately a separate, explicit action from the
  // instant local filter below, not fired on every keystroke.
  const [searchResults, setSearchResults] = useState<Recipe[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || searching) return;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await recipesApi.search(trimmed);
      setSearchResults(results);
    } catch (err) {
      setSearchResults(null);
      setSearchError(
        err instanceof Error ? err.message : "Couldn't search recipes. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchError(null);
  };

  // Refreshed on focus (not just mount) so favoriting/un-favoriting from
  // RecipeDetail is reflected here on the way back, the same pattern
  // PantryScreen already uses for its own re-fetch-on-return.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const favoriteIds = new Set(favorites.map((f) => f.id));
  const combined = [
    ...favorites,
    ...sortByMatchScore(recipes.filter((r) => !favoriteIds.has(r.id))),
  ];
  const mealTypes = uniqueMealTypes(combined);
  const cuisines = uniqueCuisines(combined);
  const filtered = filterByTitle(
    filterByCuisine(filterByMealType(combined, mealTypeFilter), cuisineFilter),
    query
  );
  const trimmedQuery = query.trim();

  return (
    <Screen>
      <Header title="Recipes" subtitle="Suggested from what's in your pantry" />
      <View style={styles.searchWrapper}>
        <TextField
          placeholder="Search recipes"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (searchResults || searchError) clearSearch();
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {trimmedQuery && !searchResults ? (
          <Button
            label={searching ? "Searching…" : `Search all recipes for "${trimmedQuery}"`}
            variant="ghost"
            onPress={handleSearch}
            disabled={searching}
            loading={searching}
            style={styles.searchAllButton}
          />
        ) : null}
        {searchResults ? (
          <Button
            label="Back to suggestions"
            variant="ghost"
            onPress={clearSearch}
            style={styles.searchAllButton}
          />
        ) : null}
        {searchError ? (
          <Text style={[styles.searchErrorText, { color: colors.danger }]}>{searchError}</Text>
        ) : null}
      </View>
      {!searchResults && mealTypes.length > 0 ? (
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
      {!searchResults && cuisines.length > 0 ? (
        <View style={styles.filterRow}>
          <Pill
            label="All cuisines"
            selected={cuisineFilter === null}
            onPress={() => setCuisineFilter(null)}
          />
          {cuisines.map((cuisine) => (
            <Pill
              key={cuisine}
              label={cuisine}
              selected={cuisineFilter === cuisine}
              onPress={() => setCuisineFilter(cuisine)}
            />
          ))}
        </View>
      ) : null}
      <FlatList
        data={searchResults ?? filtered}
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
          loading && !searchResults && !searching ? (
            <RecipesSkeleton />
          ) : !loading && !searching ? (
            searchResults ? (
              <EmptyState
                icon="restaurant-outline"
                title="No matching recipes"
                message={`No recipes found for "${trimmedQuery}". Try a different search.`}
              />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={() => {
                  generate();
                  loadFavorites();
                }}
              />
            ) : combined.length > 0 ? (
              <EmptyState
                icon="restaurant-outline"
                title="No matching recipes"
                message={buildRecipesEmptyMessage(trimmedQuery, mealTypeFilter, cuisineFilter)}
              />
            ) : (
              <EmptyState
                icon="restaurant-outline"
                title="No recipes yet"
                message="Add a few pantry items and pull to refresh to get suggestions, or search all recipes above."
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
  searchWrapper: {
    paddingHorizontal: spacing.lg,
  },
  searchAllButton: {
    marginBottom: spacing.sm,
  },
  searchErrorText: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
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
  skeletonRow: {
    flexDirection: "row",
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
  tileCuisine: {
    ...typography.caption,
    marginTop: spacing.xs / 2,
  },
  matchScoreWrapper: {
    marginTop: spacing.xs,
  },
});
