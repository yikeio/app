export const API_DOMAIN = "http://43.154.70.187";
import { showToast } from "../components/ui-lib";

export function commonFetch(url: string, options: Record<string, any> = {}) {
  const token = localStorage.getItem("login_token");

  options.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return new Promise<any>((resolve, reject) => {
    return fetch(`${API_DOMAIN}/api/${url}`, options).then((res: any) => {
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
          showToast(result.message);
          reject({ result, status: res.status });
        });
      }
    });
  });
}
