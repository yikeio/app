"use client"

import { useState } from "react"
import PaymentApi, { Payment } from "@/api/payments"
import { User } from "@/api/users"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { PaymentDialog } from "../payment/dialog"
import PaymentState from "../payment/state"
import { Card } from "../ui/card"

export default function UserPayments({ user }: { user: User }) {
  const [payment, setPayment] = useState<Payment>(null)
  const { data: payments, isLoading } = useSWR("/api/payments", PaymentApi.list)

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Card className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center text-sm font-bold text-gray-500">
          <div className="w-1/4 px-4 py-2">订单号</div>
          <div className="w-1/4 px-4 py-2">内容</div>
          <div className="w-1/4 px-4 py-2">金额</div>
          <div className="w-1/4 px-4 py-2">创建时间</div>
          <div className="w-1/4 px-4 py-2">状态</div>
        </div>
        {payments.length <= 0 && <EmptyState className="min-h-[200px]" />}
        <div>
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center border-t text-sm text-gray-500">
              <div className="w-1/4 px-4 py-3">{payment.number}</div>
              <div className="w-1/4 px-4 py-3">{payment.title}</div>
              <div className="w-1/4 px-4 py-3">￥{payment.amount}</div>
              <div className="w-1/4 px-4 py-3">{formatDatetime(payment.created_at)}</div>
              <div className="w-1/4 px-4 py-3">
                <PaymentState payment={payment} onClickToPay={() => setPayment(payment)} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* 支付过程弹窗 */}
      {payment && <PaymentDialog payment={payment} onClose={() => setPayment(null)}></PaymentDialog>}
    </>
  )
}
