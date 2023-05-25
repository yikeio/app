import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { getAuthRedirect } from "@/api/auth"
import {
  activateUser,
  checkUser,
  loginUser,
  sendVerificationCode,
} from "@/api/user"
import GitHubIcon from "@/icons/github.svg"
import GoogleIcon from "@/icons/google.svg"
import {
  useBillingStore,
  useChatStore,
  useSettingsStore,
  useUserStore,
} from "@/store"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

import Divider from "@/components/divider"
import Modal from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PhoneLoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")

  const [count, setCount] = useState(0)
  const timerRef = useRef<any>(0)

  const [updateUser] = useUserStore((state) => [state.updateUser])
  const [getConversationList] = useChatStore((state) => [
    state.getConversationList,
  ])

  function resetForm() {
    setCode("")
    setPhoneNumber("")
    setCount(0)
  }

  async function getCode() {
    if (!phoneNumber) return toast.error("请填写手机号")
    if (count) return

    setCount(60)
    // 场景值
    const params = { phoneNumber: `+86:${phoneNumber}`, scene: "login" }
    try {
      await sendVerificationCode(params)

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
  async function handleLogin() {
    if (!code) return toast.error("请填写验证码")
    if (!phoneNumber) return toast.error("请填写手机号")

    try {
      const params = { phoneNumber: `+86:${phoneNumber}`, code }
      const response = await loginUser(params)

      Cookies.set("auth.token", response.value, {
        expires: new Date(response.expires_at),
      })
      resetForm()
      toast.success("登录成功")

      const user = await checkUser()
      updateUser(user)
      getConversationList(user.id)
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
            onClick={getCode}
          >
            {count || "获取验证码"}
          </Button>
        </div>
      </div>
      <div>
        <Button className="w-full" onClick={handleLogin}>
          登录
        </Button>
      </div>
    </div>
  )
}

/**
 * OAuth 模块
 * @returns
 */
export function OAuthLoginButtons() {
  const handleRedirect = async (type) => {
    const redirectUrl = getAuthRedirect(type)
    location.href = redirectUrl
  }

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row">
      <Button
        className="w-full"
        variant="outline"
        size="sm"
        onClick={() => handleRedirect("github")}
      >
        <GitHubIcon className="mr-2 h-5 w-5" />{" "}
        <span className="text-gray-600">GitHub</span>
      </Button>
      <Button
        className="w-full"
        variant="outline"
        size="sm"
        onClick={() => handleRedirect("google")}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />{" "}
        <span className="text-gray-600">Google</span>
      </Button>
    </div>
  )
}

export default function Login() {
  const router = useRouter()
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ])

  const [getUserSettings] = useSettingsStore((state) => [state.getUserSettings])

  useEffect(() => {
    checkUser()
      .then((res) => {
        updateUser(res)
        if (res.state !== "unactivated") {
          getUserSettings(res.id)
        }
      })
      .catch(() => {
        Cookies.remove("auth.token")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 如果用户已经登录，关闭登录弹窗
    if (user.id && Cookies.get("auth.token")) {
      router.back()
    }
  }, [user])

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
  const [getConversationList] = useChatStore((state) => [
    state.getConversationList,
  ])

  async function handleActivate() {
    if (!inviteCode) return toast.error("请输入邀请码")
    try {
      await activateUser({ userId: user.id, inviteCode })
      toast.success("激活成功")
      const userRes = await checkUser()
      updateUser(userRes)
      setActivateVisible(false)
      // 激活成功后，拿到用户设置信息
      getConversationList(user.id)
      getUserSettings(user.id)
    } catch (e) {}
  }

  async function tryActivate(referrer: string) {
    try {
      await activateUser({ userId: user.id, inviteCode: referrer })
      const userRes = await checkUser()
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
  }, [activateVisible, user])

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
