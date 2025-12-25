import { z } from "zod";

export const DeviceSchema = z.object({
  device_id: z.string(),
  status: z.enum(["idle", "active"]),
  active_order_id: z.string().nullable().optional(),
  assigned_table_id: z.string().nullable().optional(),
  active_token: z.string().nullable().optional(),
  last_updated: z.string()
});

export const OrderSchema = z.object({
  order_id: z.string(),
  customer_id: z.string().nullable(),
  table_id: z.string(),
  order_status: z.enum(["OPEN", "SENT", "CLOSED"]),
  payment_status: z.enum(["UNPAID", "PAID"]),
  items_snapshot: z.any().nullable().optional(),
  token_info: z.any().nullable().optional(),
  has_feedback: z.boolean(),
  feedback_status: z.string().nullable().optional()
});

export const OrderItemSchema = z.object({
  order_item_id: z.string().optional(),
  order_id: z.string().optional(),
  item_id: z.string(),
  item_name_snapshot: z.string(),
  unit_price_snapshot: z.number().nullable().optional(),
  quantity: z.number(),
  total_price: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export const MenuItemSchema = z.object({
  item_id: z.string(),
  name: z.string(),
  name_normalized: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
  is_active: z.boolean().optional(),
  image_url: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  sort_order: z.number().nullable().optional()
});

export const KioskStateResponseSchema = z.object({
  ok: z.boolean(),
  device: DeviceSchema,
  order: OrderSchema.nullable(),
  order_items: z.array(OrderItemSchema).nullable(),
  menu_items: z.array(MenuItemSchema).nullable(),
  already_completed: z.boolean().optional(),
  message: z.string().optional()
});

export const FeedbackItemPayloadSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export const SubmitFeedbackPayloadSchema = z.object({
  device_id: z.string(),
  order_id: z.string(),
  table_id: z.string(),
  customer_id: z.string().nullable(),
  overall_rating: z.number().min(1).max(5),
  general_feedback: z.string(),
  allow_contact: z.boolean(),
  item_ratings: z.array(FeedbackItemPayloadSchema),
  session_id: z.string(),
  client_ts: z.string()
});

export const SubmitFeedbackResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  reset_to_idle: z.boolean().optional()
});

export type Device = z.infer<typeof DeviceSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type KioskStateResponse = z.infer<typeof KioskStateResponseSchema>;
export type SubmitFeedbackPayload = z.infer<typeof SubmitFeedbackPayloadSchema>;
export type SubmitFeedbackResponse = z.infer<typeof SubmitFeedbackResponseSchema>;
