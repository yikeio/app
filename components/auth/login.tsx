import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import UserApi from "@/api/users"
import useAuth from "@/hooks/use-auth"
import toast from "react-hot-toast"

import Divider from "@/components/divider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OAuthLoginButtons from "./oauth-buttons"

function redirectToIntend() {
  if (window.history.length > 0) {
    window.history.back()
  } else {
    window.location.href = "/"
  }
}

export default function Login() {
  const { hasLogged, handleLoginViaSms } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")
  const [time, setTime] = useState(0)
  const timer = useRef(null)

  function resetForm() {
    setCode("")
    setPhoneNumber("")
    setTime(0)
  }

  useEffect(() => {
    timer.current && clearInterval(timer.current)
    return () => timer.current && clearInterval(timer.current)
  }, [])

  useEffect(() => {
    if (time === 60) {
      timer.current = setInterval(() => setTime((time) => --time), 1000)
    } else if (time <= 0) {
      timer.current && clearInterval(timer.current)
    }
  }, [time])

  async function sendVerifyCode() {
    if (!phoneNumber) return toast.error("请填写手机号")
    if (time) return

    setTime(60)

    try {
      await UserApi.sendVerificationCode(phoneNumber, "login")
    } catch (e) {
      console.error(e)
    }
  }

  // 登录
  async function handleAttemptViaSms() {
    if (!code) return toast.error("请填写验证码")
    if (!phoneNumber) return toast.error("请填写手机号")

    try {
      const user = await handleLoginViaSms(phoneNumber, code)

      if (user.state != "activated") {
        window.location.href = "/auth/activate"
      } else {
        redirectToIntend()
      }

      toast.success("登录成功")
      resetForm()
    } catch (e) {}
  }

  if (hasLogged) {
    redirectToIntend()
  }

  return (
    <div className="flex flex-col gap-6 bg-primary-50/70 p-6">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="" height={48} width={48} />
      </div>
      <h1 className="text-xl font-normal">登录 一刻</h1>
      <OAuthLoginButtons />
      <div className="my-2">
        <Divider label="或使用手机验证码登录" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="phone-number-input" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            手机号
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">+86</div>
            <Input
              type="text"
              id="phone-number-input"
              className="block w-full bg-white pl-12"
              placeholder="请输入手机号"
              maxLength={11}
              autoFocus={true}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="relative flex flex-col gap-0.5">
          <Label htmlFor="verify-code-input" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            验证码
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="verify-code-input"
              className="w-full rounded-md bg-white pr-24"
              placeholder="请输入验证码"
              maxLength={6}
              value={code}
              autoComplete="off"
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={time > 0}
              className="absolute inset-y-0 right-0 z-10 mr-0.5 mt-0.5 flex items-center"
              onClick={sendVerifyCode}
            >
              {time || "获取验证码"}
            </Button>
          </div>
        </div>
        <div>
          <Button className="w-full" onClick={handleAttemptViaSms}>
            登录
          </Button>
        </div>
      </div>
    </div>
  )
}
