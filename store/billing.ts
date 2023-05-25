import { create } from "zustand"

import { getPlans } from "../api/pay"
import { getUserAvailableQuota, getUserQuotas } from "../api/user"

interface BillingStore {
  // 激活弹窗
  activateVisible: boolean
  setActivateVisible: (visible: boolean) => void

  // 当前套餐
  currentCombo: any
  // 所有购买过的套餐
  allCombos: any[]
  getUserQuotaInfo(userId: string): Promise<void>

  // 可购买的套餐
  plans: any[]
  getPlans: (type: string) => Promise<void>

  // 当前已用多少token
  totalUsage: () => number
}

export const useBillingStore = create<BillingStore>()((set, get) => ({
  activateVisible: false,
  setActivateVisible: (visible: boolean) => {
    set(() => ({ activateVisible: visible }))
  },

  currentCombo: { is_available: false },
  allCombos: [],

  async getUserQuotaInfo(userId: string) {
    const [currentComboRes, allCombosRes] = await Promise.all([
      getUserAvailableQuota(userId),
      getUserQuotas(userId),
    ])
    set(() => ({
      currentCombo: currentComboRes,
      allCombos: allCombosRes,
    }))
  },

  plans: [],
  async getPlans(type: string) {
    const res = await getPlans(type)
    set(() => ({ plans: res }))
  },

  totalUsage() {
    return get().allCombos.reduce((acc, cur) => acc + cur.used_tokens_count, 0)
  },
}))
