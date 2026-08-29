export const lightColors = {
  background: "#FFFAF2", // Coconut Cream
  surface: "#FFFFFF",
  primary: "#707156", // Savory Sage, darkened ~6% for AA text contrast (was #818263, ~3.9:1 against light text)
  secondary: "#C2C395", // Avocado Smoothie
  accent: "#DDBAAE", // Blush Beet
  highlight: "#EFD7CF", // Peach Protein
  border: "#DCD4C1", // Oat Latte
  text: "#3F3A35",
  textMuted: "#8A8478",
  statBarTrack: "#8A8478", // same as textMuted here; dark mode needs its own tuned value below
  danger: "#C1554A",
  success: "#6E8F5C",
  warning: "#D8A34C",
  overlay: "rgba(63,58,53,0.4)",
};

export const darkColors = {
  background: "#22201C",
  surface: "#2C2A25",
  primary: "#C2C395",
  secondary: "#818263",
  accent: "#DDBAAE",
  highlight: "#D7BDBA", // Peach Protein, deepened from the light value for dark-mode contrast
  border: "#3F3A35",
  text: "#FFFAF2",
  textMuted: "#B3ADA0",
  // Dedicated (darker) track color for Pantry Stats' category bars. Reusing
  // textMuted here left dark mode's light-text-bordered "secondary" fill at
  // only ~2.15:1 against the track — textMuted itself can't just be
  // darkened since it's also used as body text elsewhere, needing its own
  // contrast against backgrounds/surfaces. This value sits between the two
  // possible border tones (dark #3F3A35 and light #FFFAF2) so BOTH clear
  // 3:1 against it: ~3.36:1 for the three dark-text-bordered fills and
  // ~3.22:1 for the light-text-bordered secondary fill.
  statBarTrack: "#918C82",
  danger: "#E27A6E",
  success: "#8CB176",
  warning: "#E6B863",
  overlay: "rgba(0,0,0,0.55)",
};

export type ThemeColors = typeof lightColors;
