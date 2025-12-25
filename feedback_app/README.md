# Kiosk Feedback App (Expo + React Native + TypeScript)

Production-ready kiosk flow for Persian RTL feedback collection. The app polls a backend (n8n/edge) and never writes directly to Supabase.

## Environment

Create `.env` in the project root:

```
KIOSK_DEVICE_ID=KIOSK_MAIN
API_BASE_URL=https://<your-n8n-or-edge-base>
POLL_INTERVAL_MS=2000
INACTIVITY_TIMEOUT_MS=90000
HARD_TIMEOUT_MS=180000
```

## Run

```
npm install
npm run start
```

## Kiosk setup tips

- Screen stays on with `expo-keep-awake`.
- Orientation is locked to portrait (change in `App.tsx` if needed).
- Enable Android kiosk/lock-task mode on the device if required.
- RTL is forced via `I18nManager`. If you see LTR on first run, reload the app once.

## Backend contract (must match Supabase schema)

### 1) Get kiosk state

**Request**

```
GET {API_BASE_URL}/kiosk-state?device_id=KIOSK_MAIN
```

**Response**

```
{
  "ok": true,
  "device": {
    "device_id": "KIOSK_MAIN",
    "status": "idle" | "active",
    "active_order_id": null | "string",
    "assigned_table_id": null | "string",
    "last_updated": "ISO"
  },
  "order": null | {
    "order_id": "...",
    "customer_id": null | "...",
    "table_id": "...",
    "order_status": "OPEN" | "SENT" | "CLOSED",
    "payment_status": "UNPAID" | "PAID",
    "items_snapshot": "..." | { "...": "..." },
    "token_info": null | { "...": "..." },
    "has_feedback": true | false,
    "feedback_status": null | "..."
  },
  "order_items": null | [
    {
      "item_id": "PROD-1",
      "item_name_snapshot": "...",
      "quantity": 1,
      "unit_price_snapshot": 123,
      "total_price": 123,
      "notes": null
    }
  ],
  "menu_items": null | [
    {
      "item_id": "PROD-1",
      "name": "...",
      "image_url": null | "...",
      "category": "...",
      "tags": null | "..."
    }
  ]
}
```

Notes:
- If `items_snapshot` is parseable, the app uses it.
- Otherwise the app uses `order_items`.
- `menu_items` is optional; only used for images and nicer names.

### 2) Submit feedback

**Request**

```
POST {API_BASE_URL}/submit-feedback
```

**Body**

```
{
  "device_id": "KIOSK_MAIN",
  "order_id": "...",
  "table_id": "...",
  "customer_id": null | "...",
  "overall_rating": 1 | 2 | 3 | 4 | 5,
  "general_feedback": "CHIPS: <chip1>|<chip2>\nTEXT: ...",
  "allow_contact": true | false,
  "item_ratings": [
    { "item_id": "PROD-1", "item_name": "...", "rating": 5, "comment": "..." }
  ],
  "session_id": "uuid",
  "client_ts": "ISO"
}
```

**Response**

```
{ "ok": true, "message": "Saved", "reset_to_idle": true }
```

### 3) Optional reset

**Request**

```
POST {API_BASE_URL}/kiosk-reset
```

**Body**

```
{ "device_id": "KIOSK_MAIN" }
```

**Response**

```
{ "ok": true }
```

## Notes

- The app does not use any Supabase service_role key.
- All strings live in `src/i18n/fa.ts` for Persian RTL.
