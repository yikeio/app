import Cookies from "js-cookie"

import { request } from "./common"

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
export async function getAuthUser() {
  const token = Cookies.get("auth.token")

  if (!token) {
    window.location.href = "/auth/login"
    return Promise.reject("未登录")
  }

  return request("user")
}

/**
 * 激活账户
 * @param param0
 * @returns
 */
export async function activateUser({
  userId,
  inviteCode,
}: {
  userId: number
  inviteCode: string
}) {
  return request(`users/${userId}:activate`, {
    method: "POST",
    body: JSON.stringify({
      referral_code: inviteCode,
    }),
  })
}

/**
 * 获取验证码
 * @param param0
 * @returns
 */
export async function sendVerificationCode(phoneNumber: string, scene: string) {
  return request("sms/verification-codes:send", {
    method: "POST",
    body: JSON.stringify({ scene, phone_number: `+86:${phoneNumber}` }),
  })
}

/**
 * 获取用户所有套餐列表
 * @param param0
 * @returns
 */
export async function getUserQuotas(userId: string) {
  return request(`users/${userId}/quotas`)
}

/**
 * 获取用户当前套餐信息
 * @param param0
 * @returns
 */
export async function getUserAvailableQuota(userId: string) {
  return request(`users/${userId}/quota`)
}

/**
 * 获取用户支付订单列表（包括未支付订单）
 */
export async function getListUserPayment(id: any) {
  return request(`users/${id}/payments`)
}

export async function getLeaderboards() {
  return request(`leaderboards`)
}

/**
 * 获取用户设置
 */
export async function getListUserSettings(id: any) {
  return request(`users/${id}/settings`)
}

export async function getReferrals(id: any) {
  return request(`users/${id}/referrals`)
}

export async function getPayments(id: any) {
  return request(`users/${id}/payments`)
}

/**
 * 修改用户设置
 */
export async function updateListUserSettings(
  id: any,
  data: Record<string, any>
) {
  return request(`users/${id}/settings/${data.key}`, {
    method: "PUT",
    body: JSON.stringify({
      value: data.value,
    }),
  })
}
