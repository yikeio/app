import { API_DOMAIN, request } from "../lib/request"

export function getAuthRedirectUrl(driver: string) {
  return `${API_DOMAIN}/api/auth/redirect?driver=${driver}`
}

export interface AuthToken {
  value: string
  expires_at: string
}

export async function getToken(
  code: string,
  state: string
): Promise<AuthToken> {
  return request(`auth/tokens:via-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, state }),
  }).then((res) => res.json())
}

export async function getTokenViaSms({
  phoneNumber,
  code,
}: {
  phoneNumber: string
  code: string
}) {
  return request("auth/tokens:via-sms", {
    method: "POST",
    body: JSON.stringify({
      phone_number: phoneNumber,
      sms_verification_code: code,
    }),
  })
}
