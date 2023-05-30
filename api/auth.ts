import Request, { API_DOMAIN } from "../lib/request"

export function getAuthRedirectUrl(driver: string) {
  return `${API_DOMAIN}/api/auth/redirect?driver=${driver}`
}

export interface AuthToken {
  value: string
  expires_at: string
}

export async function getToken(code: string, state: string): Promise<AuthToken> {
  return Request.postJson(`auth/tokens:via-code`, { code, state })
}

export async function getTokenViaSms({ phoneNumber, code }: { phoneNumber: string; code: string }) {
  return Request.postJson("auth/tokens:via-sms", {
    phone_number: phoneNumber,
    sms_verification_code: code,
  })
}
