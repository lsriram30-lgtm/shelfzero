import {
  feedingAmericaUrl,
  foodPantriesUrl,
  mapsSearchUrl,
  parseLocationHint,
} from "./donateLocationLinks";

describe("parseLocationHint", () => {
  it("extracts a 5-digit zip code anywhere in the text", () => {
    expect(parseLocationHint("Austin, TX 78701")).toEqual({ zip: "78701", stateAbbr: "TX" });
  });

  it("extracts a trailing real state abbreviation when there's no zip", () => {
    expect(parseLocationHint("Austin, TX")).toEqual({ zip: null, stateAbbr: "TX" });
  });

  it("is case-insensitive about the state abbreviation", () => {
    expect(parseLocationHint("Austin, tx")).toEqual({ zip: null, stateAbbr: "TX" });
  });

  it("does not treat a random trailing two-letter word as a state", () => {
    expect(parseLocationHint("Somewhere, US")).toEqual({ zip: null, stateAbbr: null });
  });

  it("returns nulls for free text with neither a zip nor a state", () => {
    expect(parseLocationHint("My apartment")).toEqual({ zip: null, stateAbbr: null });
  });

  it("returns nulls for an empty string", () => {
    expect(parseLocationHint("")).toEqual({ zip: null, stateAbbr: null });
  });
});

describe("feedingAmericaUrl", () => {
  it("prefers a zip code when one is available", () => {
    expect(feedingAmericaUrl({ zip: "78701", stateAbbr: "TX" })).toBe(
      "https://www.feedingamerica.org/find-your-local-foodbank?zip=78701"
    );
  });

  it("falls back to state when there's no zip", () => {
    expect(feedingAmericaUrl({ zip: null, stateAbbr: "TX" })).toBe(
      "https://www.feedingamerica.org/find-your-local-foodbank?state=TX"
    );
  });

  it("falls back to the plain locator page with neither", () => {
    expect(feedingAmericaUrl({ zip: null, stateAbbr: null })).toBe(
      "https://www.feedingamerica.org/find-your-local-foodbank"
    );
  });
});

describe("foodPantriesUrl", () => {
  it("prefers a zip code when one is available", () => {
    expect(foodPantriesUrl({ zip: "78701", stateAbbr: "TX" })).toBe(
      "https://www.foodpantries.org/zip/78701"
    );
  });

  it("falls back to the full state name when there's no zip", () => {
    expect(foodPantriesUrl({ zip: null, stateAbbr: "TX" })).toBe(
      "https://www.foodpantries.org/st/texas"
    );
  });

  it("falls back to the plain homepage with neither", () => {
    expect(foodPantriesUrl({ zip: null, stateAbbr: null })).toBe("https://www.foodpantries.org/");
  });
});

describe("mapsSearchUrl", () => {
  it("includes the given location text in the search query", () => {
    expect(mapsSearchUrl("Austin, TX")).toBe(
      "https://www.google.com/maps/search/?api=1&query=food%20bank%20near%20Austin%2C%20TX"
    );
  });

  it("falls back to a generic 'near me' search for blank location text", () => {
    expect(mapsSearchUrl("   ")).toBe(
      "https://www.google.com/maps/search/?api=1&query=food%20bank%20near%20me"
    );
  });
});
