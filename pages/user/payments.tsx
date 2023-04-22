import { useEffect, useState } from "react"
import { getPayments } from "@/api/user"
import { useUserStore } from "@/store"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import UserLayout from "./layout"

export default function UserInvitationPage() {
  const [payments, setPayments] = useState([])
  const [user] = useUserStore((state) => [state.user])

  useEffect(() => {
    if (!user.id) return
    getPayments(user.id).then((res) => {
      setPayments(res.result || [])
    })
  }, [user])

  const paymentState = (payment) => {
    const className = "inline-block px-1 text-xs border rounded "
    switch (payment.state) {
      case "pending":
        return (
          <span
            className={
              className + "text-orange-500 bg-orange-100 border-orange-200"
            }
          >
            待支付
          </span>
        )
        break
      case "expired":
        return (
          <span
            className={className + "text-red-500 bg-red-100 border-red-200"}
          >
            已过期
          </span>
        )
      case "paid":
        return (
          <span
            className={
              className + "text-green-500 bg-green-100 border-green-200"
            }
          >
            已支付
          </span>
        )
      default:
        return <span className={className}>未知</span>
        break
    }
  }

  return (
    <UserLayout>
      <div className="p-8">
        <div className="mt-4 ">
          <div>
            <div className="flex justify-between">
              <h2>我的订单</h2>
              {payments.length && (
                <div className="text-gray-500 text-sm">
                  共 {payments.length} 笔支付订单
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-sm text-gray-500 font-bold">
              <div className="w-1/4 py-2 px-4">订单号</div>
              <div className="w-1/4 py-2 px-4">内容</div>
              <div className="w-1/4 py-2 px-4">注册时间</div>
              <div className="w-1/4 py-2 px-4">状态</div>
            </div>
            {payments.length <= 0 && <EmptyState className="min-h-[200px]" />}
            <div>
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center text-sm text-gray-500 border-t"
                >
                  <div className="w-1/4 py-3 px-4">{payment.number}</div>
                  <div className="w-1/4 py-3 px-4">{payment.title}</div>
                  <div className="w-1/4 py-3 px-4">
                    {formatDatetime(payment.created_at)}
                  </div>
                  <div className="w-1/4 py-3 px-4">{paymentState(payment)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
