import { commonFetch } from "./common";

/**
 * 获取会话列表
 * @returns
 */
export async function getPayableQuotas(type: string) {
  return commonFetch(`pricings?quota_type=${type}`);
}

/**
 * 创建支付单
 */
export async function createPayment(data: any) {
  return commonFetch(`payments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 获取支付单详情
 */
export async function getPayment(id: any) {
  return commonFetch(`payments/${id}`);
}

/**
 * 获取用户支付订单列表（包括未支付订单）
 */
export async function getListUserPayment(id: any) {
  return commonFetch(`users/${id}/payments`);
}
