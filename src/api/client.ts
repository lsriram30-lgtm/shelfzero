import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  "https://rs1ilxb2il.c24.airoapp.ai";

export const AUTH_TOKEN_KEY = "shelfzero.authToken";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

// Plain-English fallback for when the backend doesn't send a usable message
// of its own, so an error never just shows a bare status code.
const DEFAULT_STATUS_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid. Please check your input and try again.",
  401: "You're not signed in, or your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "That couldn't be found.",
  429: "Too many requests right now. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again.",
  502: "The server is temporarily unavailable. Please try again shortly.",
  503: "The server is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

function resolveErrorDetail(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    if (typeof record.error === "string" && record.error.trim()) return record.error;
  }
  return DEFAULT_STATUS_MESSAGES[status] ?? "Something went wrong. Please try again.";
}

// While the app is still in the coding/testing phase, prefix every error
// with its status code (e.g. "429 Error: ...") so it's easy to correlate
// what's shown on-screen with what actually happened over the network.
// Worth revisiting before real users see this — a plain message without
// the code may read cleaner for production.
export function extractErrorMessage(data: unknown, status: number): string {
  return `${status} Error: ${resolveErrorDetail(data, status)}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Same fix as auth.ts: the backend's origin check applies to every
      // authenticated route, not just sign-in/sign-up.
      Origin: API_BASE_URL,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    if (response.status === 401 && token) {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
    throw new ApiError(extractErrorMessage(data, response.status), response.status, data);
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { API_BASE_URL };
