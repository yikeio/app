/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { useRouter } from "next/router"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { cn, formatNumber } from "@/lib/utils"
import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { PaymentDialog } from "@/components/payment-dialog"
import { Button } from "@/components/ui/button"
import { createPayment } from "../api/pay"
import { getListUserPayment } from "../api/users"
import { useBillingStore, useUserStore } from "../store"

export default function PricingPage() {
  const router = useRouter()
  const [user] = useUserStore((state) => [state.user])
  const [getPlans, plans] = useBillingStore((state) => [
    state.getPlans,
    state.plans,
  ])
  const [paymentDetail, setPaymentDetail] = React.useState<any>({})

  React.useEffect(() => {
    getPlans("chat")
  }, [])

  const handlePay = async (item: any) => {
    try {
      const res = await createPayment({
        quota_type: item.quota_type,
        pricing: item.pricing,
      })
      setPaymentDetail(res)
    } catch (e) {
      if (e.status === 403) {
        router.push("/user/payments")
      }
    }
  }

  // 获取用户未付款的订单先展示
  const getUnpaidPayments = async () => {
    if (!user.id) return
    const res = await getListUserPayment(user.id)
    const recentPayment = res.filter(
      (item: Record<string, string>) => item.state === "pending"
    )[0]

    if (recentPayment) {
      setPaymentDetail(recentPayment)
    }
  }

  React.useEffect(() => {
    getUnpaidPayments()
  }, [user])

  return (
    <Layout>
      <Head title="购买套餐" />
      <div className="container mx-auto flex flex-col gap-6 px-5 py-6 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex w-full flex-col text-center">
          <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl">
            购买
          </h1>
          <div className="mx-auto text-base leading-relaxed text-gray-500 lg:w-2/3">
            按照您的使用习惯，选择合适您的付费套餐
          </div>
        </div>
        <div className="-m-4 flex flex-wrap justify-center">
          {plans.map((item: any, index: number) => (
            <div className="w-full p-4 md:w-1/2 xl:w-1/4" key={index}>
              <div
                className={cn(
                  `relative flex h-full flex-col overflow-hidden rounded-lg border border-primary-100 bg-primary-50 p-6 shadow-sm hover:border-primary-300 hover:shadow-lg`,
                  {
                    "border-primary-500  hover:border-primary-600":
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
                  <span>实验室功能抢先体验</span>
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
