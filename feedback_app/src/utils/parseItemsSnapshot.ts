import type { MenuItem, OrderItem } from "../api/types";

export type DisplayItem = {
  item_id: string;
  name: string;
  quantity: number;
  image_url?: string | null;
};

const readItemsArray = (value: unknown): unknown[] | null => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.items)) {
      return record.items as unknown[];
    }
    if (Array.isArray(record.order_items)) {
      return record.order_items as unknown[];
    }
    if (Array.isArray(record.orderItems)) {
      return record.orderItems as unknown[];
    }
  }
  return null;
};

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseSnapshotItem = (value: unknown): DisplayItem | null => {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const itemId = String(record.item_id ?? record.id ?? record.sku ?? "").trim();
  const name = String(
    record.name ?? record.item_name ?? record.title ?? record.item_name_snapshot ?? ""
  ).trim();
  const quantity = toNumber(record.quantity ?? record.qty ?? record.count ?? 1, 1);
  if (!itemId || !name) {
    return null;
  }
  return {
    item_id: itemId,
    name,
    quantity: Math.max(1, Math.round(quantity))
  };
};

export const parseItemsSnapshot = (itemsSnapshot: unknown): DisplayItem[] | null => {
  if (!itemsSnapshot) {
    return null;
  }

  let raw: unknown = itemsSnapshot;
  if (typeof itemsSnapshot === "string") {
    try {
      raw = JSON.parse(itemsSnapshot);
    } catch {
      return null;
    }
  }

  const itemsArray = readItemsArray(raw);
  if (!itemsArray) {
    return null;
  }

  const parsed = itemsArray
    .map(parseSnapshotItem)
    .filter((item): item is DisplayItem => Boolean(item));

  return parsed.length > 0 ? parsed : null;
};

export const buildDisplayItems = (params: {
  itemsSnapshot: unknown;
  orderItems: OrderItem[] | null | undefined;
  menuItems: MenuItem[] | null | undefined;
}): DisplayItem[] => {
  const parsedSnapshot = parseItemsSnapshot(params.itemsSnapshot);
  const baseItems =
    parsedSnapshot ??
    (params.orderItems ?? []).map((item) => ({
      item_id: item.item_id,
      name: item.item_name_snapshot,
      quantity: Math.max(1, Math.round(item.quantity))
    }));

  const menuMap = new Map(
    (params.menuItems ?? []).map((item) => [item.item_id, item])
  );

  return baseItems.map((item) => {
    const menu = menuMap.get(item.item_id);
    return {
      ...item,
      name: menu?.name ?? item.name,
      image_url: menu?.image_url ?? null
    };
  });
};
