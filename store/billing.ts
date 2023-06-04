import { create } from "zustand"

import { getPlans } from "../api/payments"
import { getUserAvailableQuota, getUserQuotas } from "../api/users"

interface BillingStore {
  // 激活弹窗
  activateVisible: boolean
  setActivateVisible: (visible: boolean) => void

  // 当前套餐
  currentQuota: any
  // 所有购买过的套餐
  allQuotas: any[]
  getUserQuotaInfo(userId: number): Promise<void>

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

  currentQuota: { is_available: false },
  allQuotas: [],

  async getUserQuotaInfo(userId: number) {
    const [currentQuota, allQuotas] = await Promise.all([getUserAvailableQuota(userId), getUserQuotas(userId)])
    set(() => ({
      currentQuota: currentQuota,
      allQuotas: allQuotas,
    }))
  },

  plans: [],
  async getPlans(type: string) {
    const res = await getPlans(type)
    set(() => ({ plans: res }))
  },

  totalUsage() {
    return get().allQuotas.reduce((acc, cur) => acc + cur.used_tokens_count, 0)
  },
}))
