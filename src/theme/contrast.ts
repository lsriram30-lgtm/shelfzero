const DARK_TEXT = "#3F3A35";
const LIGHT_TEXT = "#FFFAF2";

function linearizeChannel(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return (
    0.2126 * linearizeChannel(r) + 0.7152 * linearizeChannel(g) + 0.0722 * linearizeChannel(b)
  );
}

export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Picks whichever of the app's two text tones (dark or light) reads better
// against a given background, regardless of which theme mode is active —
// some brand accent colors stay pale in both light and dark mode, so the
// theme's own text color isn't a safe default foreground for them.
export function readableTextColor(backgroundHex: string): string {
  return contrastRatio(backgroundHex, DARK_TEXT) >= contrastRatio(backgroundHex, LIGHT_TEXT)
    ? DARK_TEXT
    : LIGHT_TEXT;
}
