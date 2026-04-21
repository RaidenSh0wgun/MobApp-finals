import { apiFetch, firstValidationMessage } from "@/db/api/client";
import { deleteSecureItemAsync, getSecureItemAsync, setSecureItemAsync } from "@/db/api/secureStore";
import { getApiBaseUrl } from "@/db/api/config";

export const login = async (data: { username: string; password: string }) => {
  if (!data.username || !data.password) {
    return { ok: false, message: "Enter username and password" };
  }

  const { res, json, fetchFailed } = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ username: data.username, password: data.password }),
  });

  if (fetchFailed || !res) {
    return {
      ok: false as const,
      message: `Cannot reach API (${getApiBaseUrl()}).`,
    };
  }

  if (!res.ok || json.ok !== true) {
    const msg =
      (typeof json.message === "string" && json.message) ||
      firstValidationMessage(json as Record<string, unknown>) ||
      "Login failed";
    return { ok: false as const, message: msg };
  }

  const user = json.data as Record<string, unknown> | undefined;
  const token = typeof user?.token === "string" ? user.token : null;
  if (!token) {
    return { ok: false as const, message: "Server did not return a token" };
  }

  await setSecureItemAsync("session", token);
  return { ok: true as const, data: { token } };
};

export const checkToken = async (token: string) => {
  return { ok: Boolean(token) };
};

export const logout = async () => {
  const token = await getSecureItemAsync("session");
  if (token) {
    await apiFetch("/logout", { method: "GET" });
  }

  await deleteSecureItemAsync("session");
  return { ok: true };
};
