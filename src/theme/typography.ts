// Font: DM Sans. Load weights via expo-font in App.tsx and reference family names here.
export const fontFamily = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semiBold: "DMSans_700Bold",
  bold: "DMSans_700Bold",
};

export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 38 },
  h1: { fontFamily: fontFamily.bold, fontSize: 26, lineHeight: 32 },
  h2: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};
