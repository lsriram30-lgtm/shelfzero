// Turns the free-text location collected during onboarding ("City, State")
// into real, verified deep links that land a user directly on
// location-scoped results instead of a partner's bare homepage.
//
// Verified against the real sites (not guessed):
// - Feeding America's locator reads `?zip=` and `?state=` (2-letter) from
//   the URL and auto-runs the search on page load
//   (fa-get-locator.js: `getParameterByName('zip'/'state')`).
// - FoodPantries.org supports `/zip/{zip}` and `/st/{full_state_name}`
//   (underscored, lowercase) as real, distinct pages.
// AmpleHarvest's pantry search is AJAX-only (posts to admin-ajax.php, no
// URL param), and 211.org has no unified national search - each region
// runs its own separate site - so neither can be safely deep-linked; their
// URLs stay as plain homepages.

const STATE_NAMES_BY_ABBR: Record<string, string> = {
  AL: "alabama",
  AK: "alaska",
  AZ: "arizona",
  AR: "arkansas",
  CA: "california",
  CO: "colorado",
  CT: "connecticut",
  DE: "delaware",
  DC: "district_of_columbia",
  FL: "florida",
  GA: "georgia",
  HI: "hawaii",
  ID: "idaho",
  IL: "illinois",
  IN: "indiana",
  IA: "iowa",
  KS: "kansas",
  KY: "kentucky",
  LA: "louisiana",
  ME: "maine",
  MD: "maryland",
  MA: "massachusetts",
  MI: "michigan",
  MN: "minnesota",
  MS: "mississippi",
  MO: "missouri",
  MT: "montana",
  NE: "nebraska",
  NV: "nevada",
  NH: "new_hampshire",
  NJ: "new_jersey",
  NM: "new_mexico",
  NY: "new_york",
  NC: "north_carolina",
  ND: "north_dakota",
  OH: "ohio",
  OK: "oklahoma",
  OR: "oregon",
  PA: "pennsylvania",
  RI: "rhode_island",
  SC: "south_carolina",
  SD: "south_dakota",
  TN: "tennessee",
  TX: "texas",
  UT: "utah",
  VT: "vermont",
  VA: "virginia",
  WA: "washington",
  WV: "west_virginia",
  WI: "wisconsin",
  WY: "wyoming",
};

export interface LocationHint {
  zip: string | null;
  // Two-letter abbreviation, only set when it's a real US state/DC code.
  stateAbbr: string | null;
}

export function parseLocationHint(locationText: string): LocationHint {
  const zipMatch = locationText.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : null;

  // Strip a trailing zip before looking for the state abbreviation, so
  // "Austin, TX 78701" still finds "TX" instead of only matching when the
  // state is the very last token.
  const withoutZip = zip ? locationText.replace(zip, "") : locationText;
  const stateMatch = withoutZip.match(/\b([A-Za-z]{2})\b\s*$/);
  const candidate = stateMatch ? stateMatch[1].toUpperCase() : null;
  const stateAbbr = candidate && STATE_NAMES_BY_ABBR[candidate] ? candidate : null;

  return { zip, stateAbbr };
}

export function feedingAmericaUrl(hint: LocationHint): string {
  const base = "https://www.feedingamerica.org/find-your-local-foodbank";
  if (hint.zip) return `${base}?zip=${hint.zip}`;
  if (hint.stateAbbr) return `${base}?state=${hint.stateAbbr}`;
  return base;
}

export function foodPantriesUrl(hint: LocationHint): string {
  if (hint.zip) return `https://www.foodpantries.org/zip/${hint.zip}`;
  if (hint.stateAbbr) return `https://www.foodpantries.org/st/${STATE_NAMES_BY_ABBR[hint.stateAbbr]}`;
  return "https://www.foodpantries.org/";
}

export function mapsSearchUrl(locationText: string): string {
  const trimmed = locationText.trim();
  const query = trimmed ? `food bank near ${trimmed}` : "food bank near me";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
