// Retries a failing async call exactly once before giving up. Meal-plan
// generation showed real load-based flakiness live (a day that succeeds in
// isolation can still 504 when called back-to-back with others) - a single
// immediate retry gives a failed call a second shot at hitting the backend
// while it's under less load, without turning a 504 into a long retry loop.
export async function retryOnce<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return fn();
  }
}
