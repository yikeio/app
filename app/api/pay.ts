import { commonFetch } from "./common";

/**
 * 获取会话列表
 * @returns
 */
export async function getPayableQuotas(type: string) {
  return commonFetch(`payable-quotas?quota_type=${type}`);
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
