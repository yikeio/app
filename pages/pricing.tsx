import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import PaymentApi, { Payment } from "@/api/payments"
import useAuth from "@/hooks/use-auth"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { PaymentDialog } from "@/components/payment/dialog"
import PricingTable from "@/components/pricing-table"

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [payment, setPayment] = useState<Payment>(null)

  const handlePay = async (item: any) => {
    if (!user) {
      return router.push("/auth/login")
    }

    try {
      const response = await PaymentApi.create({
        quota_type: item.quota_type,
        pricing: item.pricing,
      })
      setPayment(response)
    } catch (e) {
      if (e.status === 403) {
        router.push("/user/payments")
      }
    }
  }

  // 获取用户未付款的订单先展示
  const getUnpaidPayments = async () => {
    const payments = await PaymentApi.list()
    const latestPayment = payments.filter((item: Record<string, string>) => item.state === "pending")[0]

    if (latestPayment) {
      setPayment(latestPayment)
    }
  }

  useEffect(() => {
    user && getUnpaidPayments()
  }, [user])

  return (
    <Layout>
      <Head title="购买套餐" />

      <div className="container mx-auto flex flex-col gap-6 px-5 py-6 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex w-full flex-col text-center">
          <h1 className="title-font text-forground mb-2 text-3xl font-medium sm:text-4xl">购买</h1>
          <div className="text-muted-forground mx-auto text-base leading-relaxed lg:w-2/3">
            按照您的使用习惯，选择合适您的付费套餐
          </div>
        </div>
        <PricingTable onClick={handlePay} />
      </div>
      {/* 支付过程弹窗 */}
      <PaymentDialog payment={payment} onClose={() => setPayment(null)}></PaymentDialog>
    </Layout>
  )
}
