"use client"

import { useEffect } from "react"
import { useBillingStore, useUserStore } from "@/store"
import { copyToClipboard } from "@/utils"
import toast from "react-hot-toast"

import { formatDatetime, formatTimeAgo } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import UserLayout from "./layout"

export default function UserIndexPage() {
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ])

  const [currentCombo, totalUsage, setBillingModalVisible, getUserQuotaInfo] =
    useBillingStore((state) => [
      state.currentCombo,
      state.totalUsage(),
      state.setBillingModalVisible,
      state.getUserQuotaInfo,
    ])

  useEffect(() => {
    if (!user.id) return
    getUserQuotaInfo(user.id)
  }, [user, currentCombo, getUserQuotaInfo])

  function handleLogout() {
    localStorage.removeItem("login_token")
    updateUser({})
    toast.success("已登出")
  }

  const handleBuy = () => {
    if (currentCombo) {
      toast.error("您还有未用尽的套餐")
      return
    }
    setBillingModalVisible(true)
  }

  return (
    <UserLayout>
      <section className="p-8">
        <h2>个人资料</h2>
        <div className="max-w-5xl rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-6"></div>

          <div className="flex flex-col divide-y text-gray-600">
            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">{user.name}</Label>
              <div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  退出登录
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">ID</Label>
              <div>{user.id}</div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">我的邀请码</Label>
              <div className="flex items-center gap-2">
                <span className="uppercase">{user.referral_code}</span>
                <Button
                  onClick={() => copyToClipboard(user.referral_code)}
                  size="sm"
                >
                  复制
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">使用情况</Label>
              <div>
                累计已使用 {totalUsage || 0}，剩余可用
                <span className="ml-2">
                  {currentCombo?.available_tokens_count || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">套餐</Label>
              <div>
                {currentCombo?.expired_at
                  ? `${formatDatetime(
                      currentCombo?.expired_at
                    )} 过期 (${formatTimeAgo(currentCombo?.expired_at)})`
                  : "暂无可用套餐"}

                {!currentCombo.is_available && (
                  <Button onClick={() => handleBuy()}>购买套餐</Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label className="uppercase text-gray-500">注册时间</Label>
              <div>{formatDatetime(user.created_at)}</div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  )
}
