import { request } from "../lib/request"

/**
 * 获取会话列表
 * @returns
 */
export async function getPlans(type: string) {
  return request(`pricings?quota_type=${type}`)
}

/**
 * 创建支付单
 */
export async function createPayment(data: any) {
  return request(`payments`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * 获取支付单详情
 */
export async function getPayment(id: any) {
  return request(`payments/${id}`)
}
