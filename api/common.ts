import toast from "react-hot-toast"

export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN

export function commonFetch(url: string, options: Record<string, any> = {}) {
  const token = localStorage.getItem("login_token")

  options.headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  return new Promise<any>((resolve, reject) => {
    return fetch(`${API_DOMAIN}/api/${url}`, options)
      .then((res: any) => {
        if (res.status === 204) {
          return res.text().then((result: any) => {
            resolve({ result, status: res.status })
          })
        }

        if (res.status >= 200 && res.status <= 300) {
          res.json().then((result: any) => {
            resolve({ result, status: res.status })
          })
        } else {
          res.json().then((result: any) => {
            toast.error(result.message)
            reject({ result, status: res.status })
          })
        }
      })
      .catch(() => {
        toast.error("网络错误")
        reject({ result: "网络错误", status: 500 })
      })
  })
}
