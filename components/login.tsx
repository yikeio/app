import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import toast from "react-hot-toast"

import {
  activateUser,
  checkUser,
  loginUser,
  sendVerificationCode,
} from "../api/user"
import {
  useBillingStore,
  useChatStore,
  useSettingsStore,
  useUserStore,
} from "../store"
import Modal from "./modal"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const useUserLogin = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [getConversationList] = useChatStore((state) => [
    state.getConversationList,
  ])
  const [getUserSettings] = useSettingsStore((state) => [state.getUserSettings])
  const [updateUser] = useUserStore((state) => [state.updateUser])

  useEffect(() => {
    checkUser()
      .then((res) => {
        updateUser(res.result)
        getConversationList(res.result.id)
        getUserSettings(res.result.id)
      })
      .catch(() => {
        setLoginModalVisible(true)
        localStorage.removeItem("login_token")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { loginModalVisible, setLoginModalVisible }
}

export function LoginForm({ closeModal }: { closeModal: Function }) {
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
    } catch(e) {
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
      const loginRes = await loginUser(params)
      localStorage.setItem("login_token", loginRes.result.value)
      closeModal()
      resetForm()
      toast.success("登录成功")

      const userRes = await checkUser()
      updateUser(userRes.result)
      getConversationList(userRes.result.id) 
    } catch(e) {}
  }

  return (
    <div className="flex max-w-xs flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl">欢迎回来</h1>
      </div>
      <div className="flex flex-col gap-2">
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
            className="block w-full pl-12"
            placeholder="请输入手机号"
            maxLength={11}
            autoFocus={true}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-2">
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
            className="w-full rounded-md pr-24"
            placeholder="请输入验证码"
            maxLength={4}
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
      <div className="">
        <Button className="w-full" onClick={handleLogin}>
          登录
        </Button>
      </div>
    </div>
  )
}

export function LoginDialog() {
  const { loginModalVisible, setLoginModalVisible } = useUserLogin()
  const [user] = useUserStore((state) => [state.user])
  const [getUserQuotaInfo] = useBillingStore((state) => [
    state.getUserQuotaInfo,
  ])

  useEffect(() => {
    if (!user.id && !localStorage.getItem("login_token")) {
      setLoginModalVisible(true)
    }

    if (user.id && localStorage.getItem("login_token")) {
      // 获取用户的套餐信息
      getUserQuotaInfo(user.id)
    }
  }, [user])

  return (
    <Modal
      size="xs"
      show={loginModalVisible}
      noPadding
      onClose={() => setLoginModalVisible(false)}
    >
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" alt="" height={80} width={80} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm closeModal={setLoginModalVisible} />
        </div>
      </div>
    </Modal>
  )
}

// 激活弹窗
export function ActivateDialog() {
  const [inviteCode, setInviteCode] = useState("")
  const [user, updateUser] = useUserStore((state) => [state.user, state.updateUser])
  const [activateVisible, setActivateVisible] = useBillingStore((state) => [
    state.activateVisible,
    state.setActivateVisible,
  ])

  async function handleActivate() {
    if (!inviteCode) return toast.error("请输入邀请码")
    try {
      await activateUser({ userId: user.id, inviteCode })
      toast.success("激活成功")
      setActivateVisible(false)
    } catch(e) {}
  }

  async function tryActivate() {
    try {
      await activateUser({ userId: user.id, inviteCode })
      const userRes = await checkUser()
      updateUser(userRes.result)
    } catch(e) {

    } finally {
      localStorage.removeItem("referrer")
    }
  }

  useEffect(() => {
    const { searchParams } = new URL(location.href)
    if (searchParams.get("referrer")) {
      localStorage.setItem("referrer", searchParams.get("referrer"))
    }

    if (user.state === "unactivated" && !activateVisible) {
      const referrer = localStorage.getItem("referrer")
      const token = localStorage.getItem("login_token")
      
      // 登录了没激活，但是有邀请码，尝试激活
      if (user.id && token && referrer) {
        setInviteCode(referrer)
        tryActivate()
      } else {
        toast.error("账号未激活，请先激活!")
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
