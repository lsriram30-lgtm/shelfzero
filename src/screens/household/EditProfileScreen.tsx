import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { Screen, Header, Card, Button, TextField } from "../../components";
import { PillGrid } from "../onboarding/PillGrid";
import { GroupedPillGrid, PillGroup } from "../onboarding/GroupedPillGrid";
import { CustomOptionField } from "../onboarding/CustomOptionField";
import { toggleValue } from "../onboarding/toggleValue";
import { spacing, typography } from "../../theme";
import { HouseholdStackParamList } from "../../navigation/types";

type EditProfileNavigationProp = NativeStackNavigationProp<HouseholdStackParamList, "EditProfile">;

const CUISINE_GROUPS: PillGroup[] = [
  { label: "East Asian", options: ["Chinese", "Japanese", "Korean", "Taiwanese"] },
  { label: "South Asian", options: ["North Indian", "South Indian", "Pakistani", "Sri Lankan"] },
  {
    label: "Southeast Asian",
    options: ["Thai", "Vietnamese", "Indonesian", "Filipino", "Malaysian"],
  },
  {
    label: "Middle Eastern & Mediterranean",
    options: ["Mediterranean", "Lebanese", "Turkish", "Persian", "Greek", "Israeli"],
  },
  { label: "European", options: ["Italian", "French", "Spanish", "German", "British"] },
  {
    label: "Latin American",
    options: ["Mexican", "Peruvian", "Brazilian", "Caribbean", "Argentinian"],
  },
  { label: "African", options: ["Ethiopian", "Moroccan", "Nigerian"] },
  { label: "American", options: ["American", "Southern/BBQ", "Cajun/Creole", "Tex-Mex"] },
];
const ALL_CUISINE_OPTIONS = new Set(CUISINE_GROUPS.flatMap((group) => group.options));

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Low-carb",
  "Gluten-free",
  "Dairy-free",
  "No restrictions",
];
const ALL_DIETARY_OPTIONS = new Set(DIETARY_OPTIONS);

export function EditProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<EditProfileNavigationProp>();
  const { profile, completeOnboarding } = useOnboarding();

  const [name, setName] = useState(profile?.name ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [householdAdults, setHouseholdAdults] = useState(profile?.householdAdults ?? 1);
  const [householdKids, setHouseholdKids] = useState(profile?.householdKids ?? 0);
  const [cuisinePrefs, setCuisinePrefs] = useState<string[]>(profile?.cuisinePrefs ?? []);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(profile?.dietaryPrefs ?? []);
  const [saving, setSaving] = useState(false);

  const customCuisines = cuisinePrefs.filter((c) => !ALL_CUISINE_OPTIONS.has(c));
  const customDietary = dietaryPrefs.filter((p) => !ALL_DIETARY_OPTIONS.has(p));

  const canSave = name.trim().length > 0 && location.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || !profile) return;
    setSaving(true);
    try {
      await completeOnboarding({
        ...profile,
        name: name.trim(),
        location: location.trim(),
        householdAdults,
        householdKids,
        cuisinePrefs,
        dietaryPrefs,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Couldn't save changes",
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Header title="Edit profile" subtitle="Update your info any time" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>About you</Text>
          <TextField label="Your name" placeholder="Jamie" value={name} onChangeText={setName} />
          <TextField
            label="Location"
            placeholder="City, State"
            value={location}
            onChangeText={setLocation}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Household</Text>
          <View style={styles.stepperGroup}>
            <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Adults</Text>
            <View style={styles.stepper}>
              <Button
                label="−"
                variant="outline"
                onPress={() => setHouseholdAdults((n) => Math.max(1, n - 1))}
                style={styles.stepperButton}
              />
              <Text style={[styles.stepperCount, { color: colors.text }]}>{householdAdults}</Text>
              <Button
                label="+"
                variant="outline"
                onPress={() => setHouseholdAdults((n) => Math.min(12, n + 1))}
                style={styles.stepperButton}
              />
            </View>
          </View>
          <View style={styles.stepperGroup}>
            <Text style={[styles.stepperLabel, { color: colors.textMuted }]}>Kids</Text>
            <View style={styles.stepper}>
              <Button
                label="−"
                variant="outline"
                onPress={() => setHouseholdKids((n) => Math.max(0, n - 1))}
                style={styles.stepperButton}
              />
              <Text style={[styles.stepperCount, { color: colors.text }]}>{householdKids}</Text>
              <Button
                label="+"
                variant="outline"
                onPress={() => setHouseholdKids((n) => Math.min(12, n + 1))}
                style={styles.stepperButton}
              />
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Cuisines you enjoy</Text>
          <GroupedPillGrid
            groups={CUISINE_GROUPS}
            selected={cuisinePrefs}
            onToggle={(option) => setCuisinePrefs((prev) => toggleValue(prev, option))}
          />
          <CustomOptionField
            customValues={customCuisines}
            onAdd={(value) => setCuisinePrefs((prev) => [...prev, value])}
            onRemove={(value) => setCuisinePrefs((prev) => toggleValue(prev, value))}
            placeholder="e.g. Georgian, Uzbek, Cambodian…"
          />
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Dietary preferences</Text>
          <PillGrid
            options={DIETARY_OPTIONS}
            selected={dietaryPrefs}
            onToggle={(option) => setDietaryPrefs((prev) => toggleValue(prev, option))}
          />
          <CustomOptionField
            customValues={customDietary}
            onAdd={(value) => setDietaryPrefs((prev) => [...prev, value])}
            onRemove={(value) => setDietaryPrefs((prev) => toggleValue(prev, value))}
            placeholder="e.g. FODMAP-friendly, Halal, Kosher…"
          />
        </Card>

        <Button
          label={saving ? "Saving…" : "Save changes"}
          onPress={handleSave}
          disabled={!canSave || saving}
          loading={saving}
          style={styles.saveButton}
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
  card: {},
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  stepperGroup: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  stepperLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  stepperButton: {
    width: 56,
    paddingHorizontal: 0,
  },
  stepperCount: {
    ...typography.display,
    minWidth: 60,
    textAlign: "center",
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
