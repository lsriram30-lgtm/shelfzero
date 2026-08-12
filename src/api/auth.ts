import { API_BASE_URL } from "./client";

export type AuthResult = {
  token: string;
};

export class AuthError extends Error {
  isAccountExists: boolean;

  constructor(message: string, isAccountExists: boolean) {
    super(message);
    this.name = "AuthError";
    this.isAccountExists = isAccountExists;
  }
}

const FIELD_LABELS: Record<string, string> = {
  email: "email address",
  password: "password",
  name: "name",
};

function humanizeMessage(raw: string): string {
  const match = raw.match(/^\[?\s*body\.(\w+)\s*\]?\s*(.+)$/i);
  if (!match) return raw;

  const [, field, detail] = match;
  const label = FIELD_LABELS[field.toLowerCase()] ?? field;

  if (/required|missing/i.test(detail)) return `Please enter your ${label}.`;
  if (/short|min|length/i.test(detail)) return `Your ${label} is too short.`;
  if (/invalid/i.test(detail)) return `Please enter a valid ${label}.`;
  return `There's a problem with your ${label}. Please check it and try again.`;
}

async function authRequest(path: string, body: unknown): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // BetterAuth rejects requests with no Origin header, which a bare
      // React Native fetch() never sends the way a browser would.
      Origin: API_BASE_URL,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const record = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
    const rawMessage: string =
      (typeof record?.message === "string" && record.message.trim()) ||
      (typeof record?.error === "string" && record.error.trim()) ||
      "Something went wrong. Please try again.";
    const isAccountExists = /already exist|already registered|already in use/i.test(rawMessage);
    const detail = isAccountExists
      ? "An account with this email already exists."
      : humanizeMessage(rawMessage);
    // Same __DEV__ gating as client.ts's extractErrorMessage: the status
    // code is a debugging aid, prefixed only in a dev build so it's easy to
    // correlate what's on-screen with the network call while testing - a
    // release build shows the plain message only.
    const message = __DEV__ ? `${response.status} Error: ${detail}` : detail;
    throw new AuthError(message, isAccountExists);
  }

  return data as AuthResult;
}

export const authApi = {
  signIn: (email: string, password: string) =>
    authRequest("/api/auth/sign-in/email", { email, password }),
  signUp: (name: string, email: string, password: string) =>
    authRequest("/api/auth/sign-up/email", { name, email, password }),
};
