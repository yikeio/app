import Cookies from "js-cookie"

import Request from "../lib/request"

export interface User {
  id: number
  name: string
  avatar?: string
  root_referrer_id?: string
  referrer_id?: string
  level: number
  referrer_path?: string
  referral_code?: string
  referrals_count: number
  rewards_total?: number
  unwithdrawn_rewards_total?: number
  phone_number?: string
  email?: string
  is_admin?: boolean
  first_active_at?: string
  last_active_at?: string
  state: "activated" | "unactivated" | "banned"
  referrer?: User
  referral_url: string
  has_paid: boolean
  paid_total: number
  created_at?: string
  updated_at?: string
}

export interface Reward {
  id: number
  user_id: number
  user: User
  from_user_id: number
  from_user: User
  payment_id: number
  amount: number
  rate: number
  state: string
  withdrawn_at: string
  created_at: string
}

export default class UserApi {
  static async getAuthUser(): Promise<User> {
    const token = Cookies.get("auth.token")

    if (!token) {
      window.location.href = "/auth/login"
      return Promise.reject("未登录")
    }

    return Request.getJson("user")
  }

  static async update(data: Partial<User>): Promise<User> {
    return Request.patchJson("user", data)
  }

  static async activate({ inviteCode }: { id: number; inviteCode: string }) {
    return Request.postJson(`user:activate`, {
      referral_code: inviteCode,
    })
  }

  static async getStats() {
    return Request.getJson(`user:stats`)
  }

  static async sendVerificationCode(phoneNumber: string, scene: string) {
    return Request.postJson("sms/verification-codes:send", { scene, phone_number: `+86:${phoneNumber}` })
  }

  static async getQuotas() {
    return Request.getJson(`quotas`)
  }

  static async getCurrentQuota() {
    return Request.getJson(`quota`)
  }

  static async getLeaderboards() {
    return Request.getJson(`leaderboards`)
  }

  static async getSettings() {
    return Request.getJson(`settings`)
  }

  static async updateSettingItem(key: string, value: any) {
    return Request.putJson(`settings/${key}`, {
      value: value,
    })
  }

  static async getReferrals(page: number) {
    return Request.getJson(`referrals?page=${page}`)
  }

  static async getRewards(page: number) {
    return Request.getJson(`rewards?page=${page}`)
  }

  static async getUsingQuota() {
    return Request.getJson(`quota`)
  }
}
