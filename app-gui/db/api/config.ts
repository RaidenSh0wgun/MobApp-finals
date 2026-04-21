import { Platform } from "react-native";

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/laravel/api`;
  }
  return "http://127.0.0.1:8000/api";
}
