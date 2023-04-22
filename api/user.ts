import { commonFetch } from "./common"

/**
 * 检测用户登陆
 * @returns
 */
export async function checkUser() {
  const token = localStorage.getItem("login_token")
  if (!token) {
    return Promise.reject({
      status: 404,
      result: {
        message: "暂未登录",
      },
    })
  }
  return commonFetch("user")
}

/**
 * 用户登陆
 * @param param0
 * @returns
 */
export async function loginUser({
  phoneNumber,
  code,
}: {
  phoneNumber: string
  code: string
}) {
  return commonFetch("auth/tokens:via-sms", {
    method: "POST",
    body: JSON.stringify({
      phone_number: phoneNumber,
      sms_verification_code: code,
    }),
  })
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
  return commonFetch(`users/${userId}:activate`, {
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
export async function sendVerificationCode({
  phoneNumber,
  scene,
}: {
  phoneNumber: string
  scene: string
}) {
  return commonFetch("sms/verification-codes:send", {
    method: "POST",
    body: JSON.stringify({ scene, phone_number: phoneNumber }),
  })
}

/**
 * 获取用户所有套餐列表
 * @param param0
 * @returns
 */
export async function getUserQuotas(userId: string) {
  return commonFetch(`users/${userId}/quotas`)
}

/**
 * 获取用户当前套餐信息
 * @param param0
 * @returns
 */
export async function getUserAvailableQuota(userId: string) {
  return commonFetch(`users/${userId}/quota`)
}

/**
 * 获取用户支付订单列表（包括未支付订单）
 */
export async function getListUserPayment(id: any) {
  return commonFetch(`users/${id}/payments`)
}

/**
 * 获取用户设置
 */
export async function getListUserSettings(id: any) {
  return commonFetch(`users/${id}/settings`)
}

export async function getReferrals(id: any) {
  return commonFetch(`users/${id}/referrals`)
}

export async function getPayments(id: any) {
  return commonFetch(`users/${id}/payments`)
}

/**
 * 修改用户设置
 */
export async function updateListUserSettings(
  id: any,
  data: Record<string, any>
) {
  return commonFetch(`users/${id}/settings/${data.key}`, {
    method: "PUT",
    body: JSON.stringify({
      value: data.value,
    }),
  })
}
