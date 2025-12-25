import Constants from "expo-constants";

export type AppEnv = {
  KIOSK_DEVICE_ID: string;
  API_BASE_URL: string;
  POLL_INTERVAL_MS: number;
  INACTIVITY_TIMEOUT_MS: number;
  HARD_TIMEOUT_MS: number;
};

const extra =
  Constants.expoConfig?.extra ??
  // @ts-expect-error legacy manifest
  Constants.manifest?.extra ??
  {};

const parseNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, "");

export const env: AppEnv = {
  KIOSK_DEVICE_ID: String(extra.KIOSK_DEVICE_ID || "KIOSK_MAIN"),
  API_BASE_URL: normalizeBaseUrl(String(extra.API_BASE_URL || "")),
  POLL_INTERVAL_MS: parseNumber(extra.POLL_INTERVAL_MS, 2000),
  INACTIVITY_TIMEOUT_MS: parseNumber(extra.INACTIVITY_TIMEOUT_MS, 90000),
  HARD_TIMEOUT_MS: parseNumber(extra.HARD_TIMEOUT_MS, 180000)
};

export const envReady = env.API_BASE_URL.length > 0;
