import { commonFetch, API_DOMAIN } from "./common"

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
  return commonFetch(`auth/tokens:via-code`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
