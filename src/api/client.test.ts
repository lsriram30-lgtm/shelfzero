jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { extra: {} } },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from "expo-secure-store";
import { apiClient, ApiError, extractErrorMessage } from "./client";

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe("apiClient", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockReset().mockResolvedValue(null);
    (SecureStore.deleteItemAsync as jest.Mock).mockReset().mockResolvedValue(undefined);
  });

  it("returns parsed JSON on a successful response", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, { id: "1", name: "Milk" }));
    const result = await apiClient.get<{ id: string; name: string }>("/api/pantry/1");
    expect(result).toEqual({ id: "1", name: "Milk" });
  });

  it("throws an ApiError using the server's message on failure", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(400, { message: "Bad request" }));
    await expect(apiClient.get("/api/pantry")).rejects.toMatchObject({
      message: "400 Error: Bad request",
      status: 400,
    });
  });

  it("falls back to a plain-English message when the server sends no message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(500, {}));
    await expect(apiClient.get("/api/pantry")).rejects.toMatchObject({
      message: "500 Error: Something went wrong on our end. Please try again.",
      status: 500,
    });
  });

  it("uses the server's `error` field when there's no `message` field", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      jsonResponse(429, { error: "AI service is busy. Please wait a moment and try again." })
    );
    await expect(apiClient.get("/api/meal-plan")).rejects.toMatchObject({
      message: "429 Error: AI service is busy. Please wait a moment and try again.",
      status: 429,
    });
  });

  it("clears the stored auth token on a 401 when one was present", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("stored-token");
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(401, { message: "Unauthorized" }));

    await expect(apiClient.get("/api/pantry")).rejects.toBeInstanceOf(ApiError);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("shelfzero.authToken");
  });

  it("does not try to clear a token that was never there", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(401, { message: "Unauthorized" }));

    await expect(apiClient.get("/api/pantry")).rejects.toBeInstanceOf(ApiError);
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it("sends a Bearer token when one is stored", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("stored-token");
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, {}));

    await apiClient.get("/api/pantry");

    const [, requestInit] = fetchSpy.mock.calls[0];
    expect((requestInit?.headers as Record<string, string>).Authorization).toBe(
      "Bearer stored-token"
    );
  });
});

describe("extractErrorMessage", () => {
  it("prefixes the status code, formatted as 'N Error: ...'", () => {
    expect(extractErrorMessage({ message: "Bad request" }, 400)).toBe("400 Error: Bad request");
  });

  it("prefers a `message` field over an `error` field", () => {
    expect(extractErrorMessage({ message: "From message", error: "From error" }, 400)).toBe(
      "400 Error: From message"
    );
  });

  it("uses an `error` field when there's no `message` field", () => {
    expect(extractErrorMessage({ error: "AI service is busy." }, 429)).toBe(
      "429 Error: AI service is busy."
    );
  });

  it("ignores a blank message/error and falls back to the status default", () => {
    expect(extractErrorMessage({ message: "   " }, 429)).toBe(
      "429 Error: Too many requests right now. Please wait a moment and try again."
    );
  });

  it("returns a plain-English default for a known status with no body", () => {
    expect(extractErrorMessage(undefined, 401)).toBe(
      "401 Error: You're not signed in, or your session has expired. Please sign in again."
    );
  });

  it("returns a generic but readable message for an unmapped status", () => {
    expect(extractErrorMessage(undefined, 418)).toBe(
      "418 Error: Something went wrong. Please try again."
    );
  });

  it("ignores non-string message/error fields", () => {
    expect(extractErrorMessage({ message: 42 }, 500)).toBe(
      "500 Error: Something went wrong on our end. Please try again."
    );
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

    it("omits the status-code prefix — that's a debugging aid, not something a real user needs", () => {
      expect(extractErrorMessage({ message: "Bad request" }, 400)).toBe("Bad request");
    });

    it("still falls back to the plain-English default with no prefix", () => {
      expect(extractErrorMessage(undefined, 401)).toBe(
        "You're not signed in, or your session has expired. Please sign in again."
      );
    });
  });
});
