import { create } from "zustand";
import type { KioskStateResponse, MenuItem, Order, OrderItem } from "../api/types";

export type ItemFeedback = {
  rating: number;
  commentText: string;
  chips: string[];
};

type KioskStore = {
  deviceStatus: "idle" | "active" | null;
  activeOrderId: string | null;
  assignedTableId: string | null;
  order: Order | null;
  orderItems: OrderItem[];
  menuItems: MenuItem[];
  pollingEnabled: boolean;
  sessionLocked: boolean;
  sessionId: string | null;
  sessionStartedAt: number | null;
  lastInteractionAt: number | null;
  overallRating: number | null;
  itemFeedback: Record<string, ItemFeedback>;
  generalFeedbackText: string;
  generalFeedbackChips: string[];
  allowContact: boolean;
  submitLoading: boolean;
  submitError: string | null;
  submitFailures: number;
  connectionOk: boolean;
  snackbarMessage: string | null;
  setKioskState: (payload: KioskStateResponse) => void;
  setConnectionOk: (ok: boolean) => void;
  setPollingEnabled: (enabled: boolean) => void;
  lockSession: (sessionId: string) => void;
  touch: () => void;
  setOverallRating: (rating: number) => void;
  setItemRating: (itemId: string, rating: number) => void;
  setItemCommentText: (itemId: string, text: string) => void;
  toggleItemChip: (itemId: string, chip: string) => void;
  setGeneralFeedbackText: (text: string) => void;
  toggleGeneralFeedbackChip: (chip: string) => void;
  setAllowContact: (value: boolean) => void;
  resetFeedback: () => void;
  resetAll: () => void;
  setSubmitLoading: (loading: boolean) => void;
  setSubmitError: (error: string | null) => void;
  incrementSubmitFailures: () => void;
  clearSubmitFailures: () => void;
  showSnackbar: (message: string) => void;
  clearSnackbar: () => void;
};

const initialState = {
  deviceStatus: null,
  activeOrderId: null,
  assignedTableId: null,
  order: null,
  orderItems: [],
  menuItems: [],
  pollingEnabled: true,
  sessionLocked: false,
  sessionId: null,
  sessionStartedAt: null,
  lastInteractionAt: null,
  overallRating: null,
  itemFeedback: {},
  generalFeedbackText: "",
  generalFeedbackChips: [],
  allowContact: false,
  submitLoading: false,
  submitError: null,
  submitFailures: 0,
  connectionOk: true,
  snackbarMessage: null
};

export const useKioskStore = create<KioskStore>((set, get) => ({
  ...initialState,
  setKioskState: (payload) =>
    set((state) => {
      if (state.sessionLocked) {
        return state;
      }
      return {
        ...state,
        deviceStatus: payload.device.status,
        activeOrderId: payload.device.active_order_id ?? null,
        assignedTableId: payload.device.assigned_table_id ?? null,
        order: payload.order,
        orderItems: payload.order_items ?? [],
        menuItems: payload.menu_items ?? []
      };
    }),
  setConnectionOk: (ok) => set({ connectionOk: ok }),
  setPollingEnabled: (enabled) => set({ pollingEnabled: enabled }),
  lockSession: (sessionId) =>
    set({
      sessionLocked: true,
      sessionId,
      sessionStartedAt: Date.now(),
      lastInteractionAt: Date.now(),
      pollingEnabled: false
    }),
  touch: () => set({ lastInteractionAt: Date.now() }),
  setOverallRating: (rating) => set({ overallRating: rating }),
  setItemRating: (itemId, rating) =>
    set((state) => ({
      itemFeedback: {
        ...state.itemFeedback,
        [itemId]: {
          rating,
          commentText: state.itemFeedback[itemId]?.commentText ?? "",
          chips: state.itemFeedback[itemId]?.chips ?? []
        }
      }
    })),
  setItemCommentText: (itemId, text) =>
    set((state) => ({
      itemFeedback: {
        ...state.itemFeedback,
        [itemId]: {
          rating: state.itemFeedback[itemId]?.rating ?? 0,
          commentText: text,
          chips: state.itemFeedback[itemId]?.chips ?? []
        }
      }
    })),
  toggleItemChip: (itemId, chip) =>
    set((state) => {
      const current = state.itemFeedback[itemId] ?? {
        rating: 0,
        commentText: "",
        chips: []
      };
      const exists = current.chips.includes(chip);
      const chips = exists
        ? current.chips.filter((value) => value !== chip)
        : [...current.chips, chip];
      return {
        itemFeedback: {
          ...state.itemFeedback,
          [itemId]: {
            ...current,
            chips
          }
        }
      };
    }),
  setGeneralFeedbackText: (text) => set({ generalFeedbackText: text }),
  toggleGeneralFeedbackChip: (chip) =>
    set((state) => ({
      generalFeedbackChips: state.generalFeedbackChips.includes(chip)
        ? state.generalFeedbackChips.filter((value) => value !== chip)
        : [...state.generalFeedbackChips, chip]
    })),
  setAllowContact: (value) => set({ allowContact: value }),
  resetFeedback: () =>
    set({
      overallRating: null,
      itemFeedback: {},
      generalFeedbackText: "",
      generalFeedbackChips: [],
      allowContact: false,
      submitLoading: false,
      submitError: null,
      submitFailures: 0
    }),
  resetAll: () => set({ ...initialState, connectionOk: get().connectionOk }),
  setSubmitLoading: (loading) => set({ submitLoading: loading }),
  setSubmitError: (error) => set({ submitError: error }),
  incrementSubmitFailures: () =>
    set((state) => ({ submitFailures: state.submitFailures + 1 })),
  clearSubmitFailures: () => set({ submitFailures: 0 }),
  showSnackbar: (message) => set({ snackbarMessage: message }),
  clearSnackbar: () => set({ snackbarMessage: null })
}));
