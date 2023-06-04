import Cookies from "js-cookie"

import Request from "../lib/request"

export interface User {
  id: number
  name: string
  avatar?: string
  root_referrer_id?: number
  referrer_id?: number
  level: number
  referrer_path?: string
  referral_code?: string
  referrals_count: number
  phone_number?: string
  email?: string
  is_admin?: boolean
  first_active_at?: string
  last_active_at?: string
  state: "activated" | "unactivated" | "banned"
  referrer?: User
  referral_url: string
  paid_total: number
  created_at?: string
  updated_at?: string
}

export async function getAuthUser(): Promise<User> {
  const token = Cookies.get("auth.token")

  if (!token) {
    window.location.href = "/auth/login"
    return Promise.reject("未登录")
  }

  return Request.getJson("user")
}

export async function activateUser({ inviteCode }: { id: number; inviteCode: string }) {
  return Request.postJson(`user:activate`, {
    referral_code: inviteCode,
  })
}

export async function sendVerificationCode(phoneNumber: string, scene: string) {
  return Request.postJson("sms/verification-codes:send", { scene, phone_number: `+86:${phoneNumber}` })
}

export async function getQuotas() {
  return Request.getJson(`quotas`)
}

export async function getCurrentQuota() {
  return Request.getJson(`quota`)
}

export async function getLeaderboards() {
  return Request.getJson(`leaderboards`)
}

export async function getSettings() {
  return Request.getJson(`settings`)
}

export async function getReferrals() {
  return Request.getJson(`referrals`)
}

export async function getPayments() {
  return Request.getJson(`payments`)
}

export async function updateSettings(key: string, value: any) {
  return Request.putJson(`settings/${key}`, {
    value: value,
  })
}
