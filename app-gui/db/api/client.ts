import { getApiBaseUrl } from "@/db/api/config";
import { getSecureItemAsync } from "@/db/api/secureStore";

type JsonRecord = Record<string, unknown>;

export type ApiFetchResult = {
  res: Response | null;
  json: JsonRecord;
  fetchFailed: boolean;
};

export async function apiFetch(path: string, init: RequestInit = {}): Promise<ApiFetchResult> {
  const token = await getSecureItemAsync("session");
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${getApiBaseUrl()}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    return { res: null, json: {}, fetchFailed: true };
  }

  let json: JsonRecord = {};
  try {
    json = (await res.json()) as JsonRecord;
  } catch {
    json = {};
  }

  return { res, json, fetchFailed: false };
}

export function firstValidationMessage(json: JsonRecord): string | null {
  const errors = json.errors;
  if (!errors || typeof errors !== "object") {
    return null;
  }

  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      return value[0];
    }
  }

  return null;
}
