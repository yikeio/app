import { create } from "zustand";

interface BillingStore {
  billingModalVisible: boolean;
  setBillingModalVisible: (visible: boolean) => void;

  availableTokens: number;
  setAvailableTokens: (tokens: number) => void;

  usedTokens: number;
  setUsedTokens: (tokens: number) => void;

  // 当前套餐
  currentCombo: any;
  setCurrentCombo: (combo: any) => void;
  // 所有购买过的套餐
  allCombos: any[];
  setAllCombos: (combos: any[]) => void;
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

  currentCombo: null,
  setCurrentCombo: (combo: any) => {
    set(() => ({ currentCombo: combo }));
  },

  allCombos: [],
  setAllCombos: (combos: any[]) => {
    set(() => ({ allCombos: combos }));
  },
}));
