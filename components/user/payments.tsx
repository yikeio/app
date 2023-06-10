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
      <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
        <table className="my-0 w-full min-w-max text-left text-sm">
          <thead className="text-sm font-bold uppercase">
            <tr>
              <td className="border-none">订单号</td>
              <td className="border-none">内容</td>
              <td className="border-none">金额</td>
              <td className="border-none">创建时间</td>
              <td className="border-none">状态</td>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t text-sm">
                <td className="border-none px-4 py-3">{payment.number}</td>
                <td className="border-none px-4 py-3">{payment.title}</td>
                <td className="border-none px-4 py-3">￥{payment.amount}</td>
                <td className="border-none px-4 py-3">{formatDatetime(payment.created_at)}</td>
                <td className="border-none px-4 py-3">
                  <PaymentState payment={payment} onClickToPay={() => setPayment(payment)} />
                </td>
                <td className="border-none px-4 py-3">{formatDatetime(payment.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length <= 0 && <EmptyState className="min-h-[200px]" />}
      </Card>
      {/* 支付过程弹窗 */}
      {payment && <PaymentDialog payment={payment} onClose={() => setPayment(null)}></PaymentDialog>}
    </>
  )
}
