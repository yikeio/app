import Cookies from "js-cookie"

import { request } from "../lib/request"

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
  paid_total: number
  created_at?: string
  updated_at?: string
}

/**
 * 检测用户登陆
 * @returns
 */
export async function getAuthUser(): Promise<User> {
  const token = Cookies.get("auth.token")

  if (!token) {
    window.location.href = "/auth/login"
    return Promise.reject("未登录")
  }

  return request("user")
}

export async function activateUser({ id: id, inviteCode }: { id: number; inviteCode: string }) {
  return request(`users/${id}:activate`, {
    method: "POST",
    body: JSON.stringify({
      referral_code: inviteCode,
    }),
  })
}

export async function sendVerificationCode(phoneNumber: string, scene: string) {
  return request("sms/verification-codes:send", {
    method: "POST",
    body: JSON.stringify({ scene, phone_number: `+86:${phoneNumber}` }),
  })
}

export async function getUserQuotas(id: number) {
  return request(`users/${id}/quotas`)
}

export async function getUserAvailableQuota(id: number) {
  return request(`users/${id}/quota`)
}

export async function getLeaderboards() {
  return request(`leaderboards`)
}

export async function getUserSettings() {
  return request(`settings`)
}

export async function getReferrals() {
  return request(`referrals`)
}

export async function getPayments() {
  return request(`payments`)
}

export async function updateUserSettings(key: string, value: any) {
  return request(`settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({
      value: value,
    }),
  })
}
