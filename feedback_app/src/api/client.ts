import { env } from "../utils/env";
import {
  KioskStateResponseSchema,
  SubmitFeedbackPayload,
  SubmitFeedbackPayloadSchema,
  SubmitFeedbackResponseSchema
} from "./types";

const buildUrl = (path: string) => `${env.API_BASE_URL}${path}`;

const fetchJson = async (input: string, init?: RequestInit) => {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON");
  }
};

export const getKioskState = async (deviceId: string) => {
  const url = buildUrl(
    `/kiosk-state?device_id=${encodeURIComponent(deviceId)}`
  );
  const json = await fetchJson(url, { method: "GET" });
  const parsed = KioskStateResponseSchema.parse(json);
  if (!parsed.ok) {
    throw new Error(parsed.message ?? "Request failed");
  }
  return parsed;
};

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  const validated = SubmitFeedbackPayloadSchema.parse(payload);
  const json = await fetchJson(buildUrl("/submit-feedback"), {
    method: "POST",
    body: JSON.stringify(validated)
  });
  const parsed = SubmitFeedbackResponseSchema.parse(json);
  if (!parsed.ok) {
    throw new Error(parsed.message ?? "Submit failed");
  }
  return parsed;
};

export const kioskReset = async (deviceId: string) => {
  const json = await fetchJson(buildUrl("/kiosk-reset"), {
    method: "POST",
    body: JSON.stringify({ device_id: deviceId })
  });
  const parsed = SubmitFeedbackResponseSchema.parse(json);
  if (!parsed.ok) {
    throw new Error(parsed.message ?? "Reset failed");
  }
  return parsed;
};
