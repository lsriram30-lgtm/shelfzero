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
