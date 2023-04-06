import { create } from "zustand";

interface BillingStore {
  // 套餐弹窗
  billingModalVisible: boolean;
  setBillingModalVisible: (visible: boolean) => void;

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

  currentCombo: null,
  setCurrentCombo: (combo: any) => {
    set(() => ({ currentCombo: combo }));
  },

  allCombos: [],
  setAllCombos: (combos: any[]) => {
    set(() => ({ allCombos: combos }));
  },
}));
