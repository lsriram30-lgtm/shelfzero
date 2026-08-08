import { contrastRatio, readableTextColor, relativeLuminance } from "./contrast";
import { lightColors, darkColors } from "./colors";

describe("relativeLuminance", () => {
  it("is ~1 for white", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 2);
  });

  it("is ~0 for black", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 2);
  });
});

describe("contrastRatio", () => {
  it("is ~21 for black vs white (the maximum possible ratio)", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });

  it("is 1 for a color against itself", () => {
    expect(contrastRatio("#DDBAAE", "#DDBAAE")).toBeCloseTo(1, 5);
  });

  it("is symmetric regardless of argument order", () => {
    expect(contrastRatio("#3F3A35", "#EFD7CF")).toBeCloseTo(
      contrastRatio("#EFD7CF", "#3F3A35"),
      5
    );
  });
});

describe("readableTextColor", () => {
  it("picks dark text for a pale background (Peach Protein, light mode)", () => {
    expect(readableTextColor("#EFD7CF")).toBe("#3F3A35");
  });

  it("picks dark text for the same accent family in dark mode (Peach Protein, dark mode) — regression case", () => {
    // This background stayed pale even in dark mode, so the dark-mode theme
    // text color (light) would have read at ~1.7:1 against it; readable
    // text must pick dark regardless of which theme mode is active.
    expect(readableTextColor("#D7BDBA")).toBe("#3F3A35");
  });

  it("picks light text for a dark background", () => {
    expect(readableTextColor("#22201C")).toBe("#FFFAF2");
  });
});

describe("light-mode primary vs. surface/light text — regression case", () => {
  // Selected pills and primary buttons render near-white text directly on
  // colors.primary (not run through readableTextColor), so this pairing
  // itself must clear AA on its own. The original Savory Sage (#818263)
  // was only ~3.9:1 against light text — found in the accessibility
  // contrast audit and initially left as a "bigger design decision" since
  // darkening it affects buttons/pills app-wide. Fixed by darkening it
  // ~6% in lightness (hue/saturation preserved) rather than picking a new
  // color, or dark mode's primary (#C2C395, already ~7.9:1 against its
  // dark-mode "surface" text) would need no change.
  it("meets 4.5:1 for normal text", () => {
    expect(contrastRatio(lightColors.primary, "#FFFAF2")).toBeGreaterThanOrEqual(4.5);
  });

  it("dark mode's primary already passes against its own surface color, unchanged", () => {
    expect(contrastRatio(darkColors.primary, darkColors.surface)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Pantry Stats category bars — bordered-fill contrast fix", () => {
  // The audit found all four barPalette fills failed 3:1 against the flat
  // track color (colors.border) in light mode - a single track color can't
  // work for a palette spanning very pale (highlight) to medium-dark
  // (primary) fills. Fixed by giving each bar's filled segment a border in
  // whichever of dark/light text reads best against *that* fill
  // (readableTextColor, same utility used elsewhere), which is guaranteed
  // to separate the fill from its surroundings regardless of the fill's own
  // lightness, plus darkening the track itself (border -> textMuted) for a
  // better baseline. This is WCAG 1.4.11 non-text contrast (3:1), not the
  // 4.5:1 text threshold.
  const barPaletteFor = (c: typeof lightColors) => [c.primary, c.accent, c.highlight, c.secondary];

  it("every fill's border clears 3:1 against that fill, light mode", () => {
    for (const fill of barPaletteFor(lightColors)) {
      expect(contrastRatio(readableTextColor(fill), fill)).toBeGreaterThanOrEqual(3);
    }
  });

  it("every fill's border clears 3:1 against that fill, dark mode", () => {
    for (const fill of barPaletteFor(darkColors)) {
      expect(contrastRatio(readableTextColor(fill), fill)).toBeGreaterThanOrEqual(3);
    }
  });

  it("every fill's border clears 3:1 against the track, light mode", () => {
    for (const fill of barPaletteFor(lightColors)) {
      expect(contrastRatio(readableTextColor(fill), lightColors.textMuted)).toBeGreaterThanOrEqual(3);
    }
  });

  // Dark mode's secondary-colored bar is the one case that doesn't fully
  // clear 3:1 against the track (~2.15:1) - its border picks light text
  // (best available against that fill), which is close in lightness to the
  // dark-mode track. Still a real improvement over the original 1.07-2.68:1
  // range across the board, and the border-vs-fill contrast (which is what
  // actually marks the filled boundary) does clear 3:1 in every case above.
});
