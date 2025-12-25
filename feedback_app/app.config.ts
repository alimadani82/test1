import "dotenv/config";
import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Kiosk Feedback",
  slug: "kiosk-feedback",
  scheme: "kiosk-feedback",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F7F1E8"
  },
  assetBundlePatterns: ["**/*"],
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F7F1E8"
    }
  },
  extra: {
    KIOSK_DEVICE_ID: process.env.KIOSK_DEVICE_ID,
    API_BASE_URL: process.env.API_BASE_URL,
    POLL_INTERVAL_MS: process.env.POLL_INTERVAL_MS,
    INACTIVITY_TIMEOUT_MS: process.env.INACTIVITY_TIMEOUT_MS,
    HARD_TIMEOUT_MS: process.env.HARD_TIMEOUT_MS
  }
});
