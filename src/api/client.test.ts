jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { expoConfig: { extra: {} } },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from "expo-secure-store";
import { apiClient, ApiError } from "./client";

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
      message: "Bad request",
      status: 400,
    });
  });

  it("falls back to a generic message when the server sends no message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(jsonResponse(500, {}));
    await expect(apiClient.get("/api/pantry")).rejects.toMatchObject({
      message: "Request failed with status 500",
      status: 500,
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
