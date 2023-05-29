"use client"

import { useBillingStore, useUserStore } from "@/store"
import { copyToClipboard } from "@/utils"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

import { formatDatetime, formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import UserLayout from "./layout"

export default function UserIndexPage() {
  const [user, updateUser] = useUserStore((state) => [state.user, state.updateUser])

  const [currentCombo, totalUsage] = useBillingStore((state) => [state.currentQuota, state.totalUsage()])

  function handleLogout() {
    Cookies.remove("auth.token")
    updateUser({})
    toast.success("已登出")
  }

  const handleBuy = () => {
    location.href = "/pricing"
  }

  return (
    <UserLayout>
      <section className="p-4 md:p-8">
        <h2>个人资料</h2>
        <div className="max-w-5xl rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col divide-y text-gray-600">
            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">{user.name}</Label>
              <div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  退出登录
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">ID</Label>
              <div>{user.id}</div>
            </div>

            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">我的邀请码</Label>
              <div className="flex items-center gap-2">
                <span className="uppercase">{user.referral_code}</span>
                <Button onClick={() => copyToClipboard(user.referral_code)} size="sm">
                  复制
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">使用情况</Label>
              <div className="flex flex-col gap-4 md:flex-row">
                <div>累计已使用 {totalUsage || 0}，剩余可用</div>
                <span className="ml-2">{(currentCombo.is_available && currentCombo?.available_tokens_count) || 0}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">套餐</Label>
              <div className="flex flex-col gap-4 md:flex-row">
                <div>
                  {currentCombo?.expired_at
                    ? `${formatDatetime(currentCombo?.expired_at)} 过期 (${formatTimeAgo(currentCombo?.expired_at)})`
                    : "暂无可用套餐"}
                </div>
                <Button onClick={() => handleBuy()}>购买套餐</Button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
              <Label className="uppercase text-gray-400">注册时间</Label>
              <div>{formatDatetime(user.created_at)}</div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  )
}
