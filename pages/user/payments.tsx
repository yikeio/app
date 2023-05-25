"use client"

import { useEffect, useState } from "react"
import { getPayments } from "@/api/user"
import { useUserStore } from "@/store"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import { PaymentDialog } from "@/components/payment-dialog"
import LinkButton from "@/components/ui/link-button"
import UserLayout from "./layout"

export default function UserInvitationPage() {
  const [payments, setPayments] = useState([])
  const [user] = useUserStore((state) => [state.user])
  const [paymentDetail, setPaymentDetail] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user.id) return
    getPayments(user.id).then((res) => {
      setPayments(res || [])
    })
  }, [user])

  const paymentState = (payment) => {
    const className = "inline-block px-1 text-xs border rounded "
    switch (payment.state) {
      case "pending":
        return (
          <>
            <span
              className={
                className + "text-orange-500 bg-orange-100 border-orange-200"
              }
            >
              待支付
            </span>
            <button
              className="ml-6 inline-block rounded bg-slate-900 p-1 text-xs text-white hover:bg-slate-700 dark:bg-primary-50"
              onClick={() => {
                setPaymentDetail(payment)
              }}
            >
              立即支付
            </button>
          </>
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
      <div className="p-4 md:p-8">
        <div className="mt-4 ">
          <div className="flex justify-between pb-4">
            <div className="flex items-center gap-4">
              <h2 className="py-0">我的订单</h2>
              {payments.length && (
                <div className="text-sm text-gray-500">
                  共 {payments.length} 笔支付订单
                </div>
              )}
            </div>
            <div>
              <a href="/pricing" className="text-blue-500">
                购买额度
              </a>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center text-sm font-bold text-gray-500">
              <div className="w-1/4 px-4 py-2">订单号</div>
              <div className="w-1/4 px-4 py-2">内容</div>
              <div className="w-1/4 px-4 py-2">创建时间</div>
              <div className="w-1/4 px-4 py-2">状态</div>
            </div>
            {payments.length <= 0 && <EmptyState className="min-h-[200px]" />}
            <div>
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center border-t text-sm text-gray-500"
                >
                  <div className="w-1/4 px-4 py-3">{payment.number}</div>
                  <div className="w-1/4 px-4 py-3">{payment.title}</div>
                  <div className="w-1/4 px-4 py-3">
                    {formatDatetime(payment.created_at)}
                  </div>
                  <div className="w-1/4 px-4 py-3">{paymentState(payment)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 支付过程弹窗 */}
      <PaymentDialog
        paymentDetail={paymentDetail}
        onClose={() => setPaymentDetail({})}
      ></PaymentDialog>
    </UserLayout>
  )
}
