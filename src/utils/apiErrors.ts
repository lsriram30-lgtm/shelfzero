import { ApiError } from "../api/client";

// The backend's exact wording for "you're not in a household right now"
// (confirmed live: `{"error":"No household. Please complete setup."}`,
// 403) - used to tell this specific case apart from any other API
// failure, e.g. to detect a mid-session removal instead of showing a
// generic error screen.
export function isNoHouseholdError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403 && /no household/i.test(err.message);
}
