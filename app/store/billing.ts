import { create } from "zustand";

type Combo = {
  id: number;
  type: "week" | "half-month" | "month";
  price: number;
  tokens?: number;
};

interface BillingStore {
  billingModalVisible: boolean;
  setBillingModalVisible: (visible: boolean) => void;

  availableTokens: number;
  setAvailableTokens: (tokens: number) => void;

  usedTokens: number;
  setUsedTokens: (tokens: number) => void;

  // 当前套餐
  currentCombo: undefined | Combo;
}

export const useBillingStore = create<BillingStore>()((set, get) => ({
  billingModalVisible: false,
  setBillingModalVisible: (visible: boolean) => {
    set(() => ({ billingModalVisible: visible }));
  },

  availableTokens: 0,
  setAvailableTokens: (tokens: number) => {
    set(() => ({ availableTokens: tokens }));
  },

  usedTokens: 0,
  setUsedTokens: (tokens: number) => {
    set(() => ({ usedTokens: tokens }));
  },

  currentCombo: undefined,
}));
