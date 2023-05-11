import { useEffect } from "react"
import { createTokens } from "@/api/auth"
import toast from "react-hot-toast"

import AuthLoading from "../../icons/auth-loading.svg"

export default function OAuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    const state = urlParams.get("state")
    // 走 oauth 登陆
    if (code && state) {
      createTokens({ code, state }).then((loginRes) => {
        localStorage.setItem("login_token", loginRes.result.value)
        toast.success("登录成功")
        location.href = "/chat"
      })
      return
    } else {
      location.href = "/"
    }
  }, [])
  return (
    <div className="flex h-screen">
      <AuthLoading />
    </div>
  )
}
