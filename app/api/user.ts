import { commonFetch } from "./common";

/**
 * 检测用户登陆
 * @returns
 */
export async function checkUser() {
  const token = localStorage.getItem("login_token");
  if (!token) {
    throw new Error("暂未登录");
  }

  return commonFetch("/api/user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * 注册用户
 * @param param0
 * @returns
 */
export async function createUser({
  phoneNumber,
  code,
  inviteCode,
}: {
  phoneNumber: string;
  code: string;
  inviteCode: string;
}) {
  return commonFetch("api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      sms_verification_code: code,
      referral_code: inviteCode,
    }),
  });
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
  phoneNumber: string;
  code: string;
}) {
  return commonFetch("oauth/tokens:via-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      sms_verification_code: code,
    }),
  });
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
  phoneNumber: string;
  scene: string;
}) {
  return commonFetch("sms/verification-codes:send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scene, phone_number: phoneNumber }),
  });
}
