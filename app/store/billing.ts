import { create } from "zustand";
import { getUserQuotas, getUserAvailableQuotas } from "../api/user";
import { getPayableQuotas } from "../api/pay";

interface BillingStore {
  // 套餐弹窗
  billingModalVisible: boolean;
  setBillingModalVisible: (visible: boolean) => void;

  // 当前套餐
  currentCombo: any;
  // 所有购买过的套餐
  allCombos: any[];
  getUserQuotaInfo(userId: string): Promise<void>;

  // 可购买的套餐
  payableQuotas: any[];
  getPayableQuotas: (type: string) => Promise<void>;
}

export const useBillingStore = create<BillingStore>()((set, get) => ({
  billingModalVisible: false,
  setBillingModalVisible: (visible: boolean) => {
    set(() => ({ billingModalVisible: visible }));
  },

  currentCombo: null,
  allCombos: [],

  async getUserQuotaInfo(userId: string) {
    const [currentComboRes, allCombosRes] = await Promise.all([
      getUserAvailableQuotas(userId),
      getUserQuotas(userId),
    ]);
    set(() => ({
      currentCombo: currentComboRes.result.chat,
      allCombos: allCombosRes.result,
    }));
  },

  payableQuotas: [],
  async getPayableQuotas(type: string) {
    const res = await getPayableQuotas(type);
    set(() => ({ payableQuotas: res.result }));
  },
}));
