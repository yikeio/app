import { NextRequest } from "next/server";

const API_DOMAIN = "http://192.168.31.73:8000";
const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  console.log("[Proxy] ", openaiPath);

  return fetch(`${PROTOCOL}://${BASE_URL}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}

export function commonFetch(url: string, options: any) {
  return new Promise<any>((resolve, reject) => {
    return fetch(`${API_DOMAIN}/api/${url}`, options).then((res: any) => {
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
