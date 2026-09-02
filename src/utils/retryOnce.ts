import { ApiError } from "../api/client";

// Retries a failing async call exactly once before giving up. Meal-plan
// generation showed real load-based flakiness live (a day that succeeds in
// isolation can still 504 when called back-to-back with others) - a single
// immediate retry gives a failed call a second shot at hitting the backend
// while it's under less load, without turning a 504 into a long retry loop.
export async function retryOnce<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // A 429 means the backend is already telling us it's rate-limited -
    // retrying instantly just adds a second request on top of an already-
    // busy backend and makes the user wait through two failing calls
    // instead of one, for no real chance of a different outcome. Only
    // worth a second shot for a genuine transient failure (e.g. the 504
    // this was built for), where the backend wasn't refusing the request
    // outright.
    if (err instanceof ApiError && err.status === 429) throw err;
    return fn();
  }
}
