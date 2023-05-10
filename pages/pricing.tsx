/* eslint-disable @next/next/no-img-element */
import * as React from "react"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { PaymentDialog } from "@/components/payment-dialog"
import { Button } from "@/components/ui/button"
import { createPayment } from "../api/pay"
import { getListUserPayment } from "../api/user"
import { useBillingStore, useUserStore } from "../store"

export default function PricingPage() {
  const [user] = useUserStore((state) => [state.user])
  const [getPayableQuotas, payableQuotas, getUserQuotaInfo] = useBillingStore(
    (state) => [
      state.getPayableQuotas,
      state.payableQuotas,
      state.getUserQuotaInfo,
    ]
  )
  const [paymentDetail, setPaymentDetail] = React.useState<any>({})

  React.useEffect(() => {
    getPayableQuotas("chat")
  }, [])

  /**

  /**
   * 支付
   * @param item
   */
  const handlePay = async (item: any) => {
    try {
      const res = await createPayment({
        quota_type: item.quota_type,
        pricing: item.pricing,
      })
      setPaymentDetail(res.result)
    } catch (e) {
      if (e.status === 403) {
        location.href = "/user/payments"
      }
    }
  }

  // 获取用户未付款的订单先展示
  const getListUserPaymentList = async () => {
    if (!user.id) return
    const res = await getListUserPayment(user.id)
    const recentPayment = res.result.filter(
      (item: Record<string, string>) => item.state === "pending"
    )[0]

    if (recentPayment) {
      setPaymentDetail(recentPayment)
    }
  }

  React.useEffect(() => {
    getListUserPaymentList()
  }, [user])

  return (
    <Layout>
      <Head title="购买套餐" />
      <div className="flex-1">
        <section className="mx-auto max-w-5xl p-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">购买套餐</div>
          </div>
          <div className="mt-4 flex-1 space-y-6 rounded-lg bg-white p-3 shadow md:p-6">
            <div className="-m-4 flex flex-wrap">
              {payableQuotas.map((item: any, index: number) => (
                <div className="p-4 md:w-1/2 xl:w-1/3">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-blue-500 p-6">
                    <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900">
                      ￥ {item.price}
                    </h1>
                    <p className="mb-2 flex items-center text-gray-600">
                      <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-400 text-white">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </span>
                      {item.title}
                    </p>
                    <p className="mb-6 flex items-center text-gray-600">
                      <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-400 text-white">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </span>
                      <span className="mr-2 font-bold">
                        {String(item.tokens_count).replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                      </span>
                      <span>Token</span>
                    </p>
                    <Button onClick={() => handlePay(item)}>
                      购买
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="ml-auto h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </Button>
                    {/* <p className="mt-3 text-xs text-gray-500">
                    使用时间
                  </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* 支付过程弹窗 */}
      <PaymentDialog
        paymentDetail={paymentDetail}
        onClose={() => setPaymentDetail({})}
      ></PaymentDialog>
    </Layout>
  )
}
