jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { extra: {} } },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import { authApi, AuthError } from "./auth";

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe("authApi", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the token on a successful sign-in", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, { token: "abc123" }));
    const result = await authApi.signIn("jamie@example.com", "hunter2");
    expect(result).toEqual({ token: "abc123" });
  });

  it("uses the server's `error` field when there's no `message` field", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse(500, { error: "Server is down for maintenance." }));
    await expect(authApi.signIn("jamie@example.com", "hunter2")).rejects.toMatchObject({
      message: "500 Error: Server is down for maintenance.",
    });
  });

  it("falls back to a generic message when there's no message or error field", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(500, {}));
    await expect(authApi.signIn("jamie@example.com", "hunter2")).rejects.toMatchObject({
      message: "500 Error: Something went wrong. Please try again.",
    });
  });

  it("detects an already-exists account and sets isAccountExists", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse(400, { message: "User already exists" }));
    try {
      await authApi.signUp("Jamie", "jamie@example.com", "hunter2");
      throw new Error("expected signUp to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(AuthError);
      expect((err as AuthError).isAccountExists).toBe(true);
      expect((err as AuthError).message).toBe(
        "400 Error: An account with this email already exists."
      );
    }
  });

  it("humanizes a required-field validation message", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse(400, { message: "[body.email] is required" }));
    await expect(authApi.signIn("", "hunter2")).rejects.toMatchObject({
      message: "400 Error: Please enter your email address.",
    });
  });

  it("humanizes a too-short validation message", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse(400, { message: "body.password too short" }));
    await expect(authApi.signIn("jamie@example.com", "a")).rejects.toMatchObject({
      message: "400 Error: Your password is too short.",
    });
  });

  it("leaves an unrecognized message shape as-is", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(jsonResponse(400, { message: "Totally unrelated error" }));
    await expect(authApi.signIn("jamie@example.com", "hunter2")).rejects.toMatchObject({
      message: "400 Error: Totally unrelated error",
    });
  });

  describe("in a real (non-dev) build", () => {
    const originalDev = __DEV__;

    beforeEach(() => {
      // @ts-expect-error __DEV__ is a read-only RN global; reassigning it is
      // only for this test's own sake, to simulate a release build.
      __DEV__ = false;
    });

    afterEach(() => {
      // @ts-expect-error see above
      __DEV__ = originalDev;
    });

    it("omits the status-code prefix", async () => {
      jest
        .spyOn(global, "fetch")
        .mockResolvedValue(jsonResponse(500, { error: "Server is down for maintenance." }));
      await expect(authApi.signIn("jamie@example.com", "hunter2")).rejects.toMatchObject({
        message: "Server is down for maintenance.",
      });
    });
  });
});
