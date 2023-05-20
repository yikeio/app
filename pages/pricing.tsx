/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import classNames from "classnames"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { formatNumber } from "@/lib/utils"
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
      <div className="container mx-auto px-5 py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl">
            购买
          </h1>
          <p className="mx-auto text-base leading-relaxed text-gray-500 lg:w-2/3">
            按照您的使用习惯，选择合适您的付费套餐
          </p>
        </div>
        <div className="-m-4 flex flex-wrap justify-center">
          {payableQuotas.map((item: any, index: number) => (
            <div className="w-full p-4 md:w-1/2 xl:w-1/4" key={index}>
              <div
                className={classNames(
                  `relative flex h-full flex-col overflow-hidden rounded-lg border shadow-sm hover:shadow-lg hover:border-gray-300 bg-white p-6`,
                  {
                    "border-indigo-500  hover:border-indigo-500":
                      item.is_popular,
                  }
                )}
              >
                {item.is_popular && (
                  <span className="absolute right-0 top-0 rounded-bl bg-indigo-500 px-3 py-1 text-xs tracking-widest text-white">
                    POPULAR
                  </span>
                )}
                <div className="title-font mb-1 text-sm font-medium tracking-widest text-gray-500">
                  {item.title}
                </div>
                <h1 className="mb-4 flex items-end border-b border-gray-200 pb-4 text-4xl font-normal leading-none text-gray-900">
                  <span>￥{item.price}</span>
                  <span className="ml-1 text-lg font-normal text-gray-400">
                    {" "}
                    / {item.days}天
                  </span>
                </h1>
                <div className="mb-2 flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>{item.days} 天使用期限</span>
                </div>
                <div className="mb-2 flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>{formatNumber(item.tokens_count)} tokens</span>
                </div>
                <div className="mb-2 flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>无限制预设角色使用</span>
                </div>
                <div className="mb-2 flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>API 访问能力</span>
                </div>
                <div className="mb-2 flex items-center gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500" size={16} />
                  <span>24 小时客户服务</span>
                </div>
                <Button
                  className="mt-6 justify-between"
                  onClick={() => handlePay(item)}
                >
                  购买
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 支付过程弹窗 */}
      <PaymentDialog
        paymentDetail={paymentDetail}
        onClose={() => setPaymentDetail({})}
      ></PaymentDialog>
    </Layout>
  )
}
