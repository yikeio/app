import { useEffect, useState } from "react"
import { activateUser } from "@/api/users"
import useAuth from "@/hooks/use-auth"
import Cookies from "js-cookie"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ActivatePage() {
  const [inviteCode, setInviteCode] = useState("")
  const { user, hasLogged, refreshAuthUser } = useAuth()

  const redirectToIntend = () => {
    if (window.history.length > 0) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  async function handleActivate() {
    if (!inviteCode) return toast.error("请输入邀请码")
    try {
      await activateUser({ id: user.id, inviteCode })
      toast.success("激活成功")
      redirectToIntend()
    } catch (e) {}
  }

  async function tryActivate(referrer: string) {
    try {
      await activateUser({ id: user.id, inviteCode: referrer })
      refreshAuthUser()
      redirectToIntend()
    } catch (e) {
      setInviteCode(referrer)
      toast.error("账号未激活，请先激活!")
    } finally {
      Cookies.remove("referrer")
    }
  }

  useEffect(() => {
    if (!user) {
      return
    }
    if (user.state === "unactivated") {
      const referrer = Cookies.get("referrer")
      const token = Cookies.get("auth.token")

      // 登录了没激活，但是本地存储有邀请码，尝试激活
      if (user.id && token && referrer) {
        tryActivate(referrer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <div className="flex max-w-full flex-col gap-4 overflow-hidden rounded-lg border p-6">
        <header>
          <h2>请输入邀请码</h2>
          <p className="text-gray-500">当前为内测期间，你需要输入邀请码才能使用</p>
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
    </div>
  )
}
