const DOMAIN = "http://192.168.31.73:8000";

export function commonFetch(url: string, options: any) {
  return new Promise<any>((resolve, reject) => {
    return fetch(url, options).then((res: any) => {
      console.log("handleFetch", res);

      if (res.status === 204) {
        return res.text().then((result: any) => {
          resolve({ result, status: res.status });
        });
      }

      if (res.status >= 200 && res.status <= 300) {
        res.json().then((result: any) => {
          resolve({ result, status: res.status });
        });
      } else {
        res.json().then((result: any) => {
          reject({ result, status: res.status });
        });
      }
    });
  });
}

// 检测登陆
export async function checkUser() {
  const token = localStorage.getItem("login_token");
  if (!token) {
    throw new Error("暂未登录");
  }

  return commonFetch(`${DOMAIN}/api/user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// 注册账户
export async function createUser({
  phoneNumber,
  code,
  inviteCode,
}: {
  phoneNumber: string;
  code: string;
  inviteCode: string;
}) {
  return commonFetch(`${DOMAIN}/api/users`, {
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

// 登陆账户
export async function loginUser({
  phoneNumber,
  code,
}: {
  phoneNumber: string;
  code: string;
}) {
  return commonFetch(`${DOMAIN}/api/oauth/tokens:via-sms`, {
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

// 获取验证码
export async function sendVerificationCode({
  phoneNumber,
  scene,
}: {
  phoneNumber: string;
  scene: string;
}) {
  return commonFetch(`${DOMAIN}/api/sms/verification-codes:send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scene, phone_number: phoneNumber }),
  });
}
