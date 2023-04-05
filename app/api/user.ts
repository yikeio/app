const DOMAIN = "http://192.168.31.73:8000";

function commonFetch(url: string, options: any) {
  new Promise((resolve, reject) => {
    fetch(url, options).then((res) => {
      if (res.status === 204) {
        resolve({
          status: res.status,
          result: res.text(),
        });
      }
      if (res.status >= 200 && res.status < 300) {
        resolve({
          status: res.status,
          result: res.json(),
        });
      }

      reject({
        status: res.status,
        result: res.json(),
      });
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
export async function createUser() {
  return commonFetch(`${DOMAIN}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
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
