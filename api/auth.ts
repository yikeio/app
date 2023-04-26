import { API_DOMAIN, request } from "./common"

/**
 * 获取跳转地址
 * @returns
 */
export function getAuthRedirect(driver: string) {
  return `${API_DOMAIN}/api/auth/redirect?driver=${driver}`
}

/**
 * 创建authToken
 */
export async function createTokens(data: any) {
  return request(`auth/tokens:via-code`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
