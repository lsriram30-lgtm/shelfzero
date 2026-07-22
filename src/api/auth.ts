import { API_BASE_URL } from "./client";

export type AuthResult = {
  token: string;
};

async function authRequest(path: string, body: unknown): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as AuthResult;
}

export const authApi = {
  signIn: (email: string, password: string) =>
    authRequest("/api/auth/sign-in/email", { email, password }),
  signUp: (name: string, email: string, password: string) =>
    authRequest("/api/auth/sign-up/email", { name, email, password }),
};
