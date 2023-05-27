import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { activateUser, getAuthUser, sendVerificationCode } from "@/api/user"
import useAuth from "@/hooks/use-auth"
import { useBillingStore, useSettingsStore, useUserStore } from "@/store"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

import Divider from "@/components/divider"
import Modal from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OAuthLoginButtons from "./auth/oauth-buttons"

function redirectToIntend() {
  if (window.history.length > 0) {
    window.history.back()
  } else {
    window.location.href = "/"
  }
}

export function PhoneLoginForm() {
  const auth = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")
  const [count, setCount] = useState(0)
  const timerRef = useRef<any>(0)

  function resetForm() {
    setCode("")
    setPhoneNumber("")
    setCount(0)
  }

  async function sendVerifyCode() {
    if (!phoneNumber) return toast.error("请填写手机号")
    if (count) return

    setCount(60)

    try {
      await sendVerificationCode(phoneNumber, "login")

      timerRef.current = setInterval(() => {
        setCount((count) => {
          if (count <= 0) {
            clearInterval(timerRef.current)
            return 0
          }
          return count - 1
        })
      }, 1000)
    } catch (e) {
      setCount(0)
      clearInterval(timerRef.current)
    }
  }

  // 登录
  async function handleAttemptViaSms() {
    if (!code) return toast.error("请填写验证码")
    if (!phoneNumber) return toast.error("请填写手机号")

    try {
      await auth.handleLoginViaSms(phoneNumber, code)
      redirectToIntend()
      toast.success("登录成功")
      resetForm()
    } catch (e) {}
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor="phone-number-input"
          className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
        >
          手机号
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            +86
          </div>
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
        <Label
          htmlFor="verify-code-input"
          className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
        >
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
            className="absolute inset-y-0 right-0 z-10 mr-0.5 mt-0.5 flex items-center"
            onClick={sendVerifyCode}
          >
            {count || "获取验证码"}
          </Button>
        </div>
      </div>
      <div>
        <Button className="w-full" onClick={handleAttemptViaSms}>
          登录
        </Button>
      </div>
    </div>
  )
}

export default function Login() {
  const { hasLogged } = useAuth()

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
      <PhoneLoginForm />
    </div>
  )
}

// 激活弹窗
export function ActivateDialog() {
  const [inviteCode, setInviteCode] = useState("")
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ])
  const [activateVisible, setActivateVisible] = useBillingStore((state) => [
    state.activateVisible,
    state.setActivateVisible,
  ])
  const [getUserSettings] = useSettingsStore((state) => [state.getUserSettings])

  async function handleActivate() {
    if (!inviteCode) return toast.error("请输入邀请码")
    try {
      await activateUser({ id: user.id, inviteCode })
      toast.success("激活成功")
      const userRes = await getAuthUser()
      updateUser(userRes)
      setActivateVisible(false)
      getUserSettings(user.id)
    } catch (e) {}
  }

  async function tryActivate(referrer: string) {
    try {
      await activateUser({ id: user.id, inviteCode: referrer })
      const userRes = await getAuthUser()
      updateUser(userRes)
      if (userRes.state === "activated") {
        toast.success("账号已激活")
      }
    } catch (e) {
      setInviteCode(referrer)
      toast.error("账号未激活，请先激活!")
      setActivateVisible(true)
    } finally {
      Cookies.remove("referrer")
    }
  }

  useEffect(() => {
    if (user.state === "unactivated" && !activateVisible) {
      const referrer = Cookies.get("referrer")
      const token = Cookies.get("auth.token")

      // 登录了没激活，但是本地存储有邀请码，尝试激活
      if (user.id && token && referrer) {
        tryActivate(referrer)
      } else {
        setActivateVisible(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <Modal
      show={activateVisible}
      size="sm"
      onClose={() => setActivateVisible(false)}
    >
      <div className="flex flex-col gap-6">
        <header>
          <h2>请输入邀请码</h2>
          <p className="text-gray-500">
            当前为内测期间，你需要输入邀请码才能使用
          </p>
        </header>
        <Input
          type="text"
          className="block rounded-md"
          placeholder="请输入邀请码"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button className="w-full" onClick={handleActivate}>
          激活
        </Button>
      </div>
    </Modal>
  )
}
