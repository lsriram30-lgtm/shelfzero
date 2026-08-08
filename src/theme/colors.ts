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
  danger: "#E27A6E",
  success: "#8CB176",
  warning: "#E6B863",
  overlay: "rgba(0,0,0,0.55)",
};

export type ThemeColors = typeof lightColors;
