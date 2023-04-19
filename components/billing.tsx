/* eslint-disable @next/next/no-img-element */
import * as React from "react"

import { createPayment, getPayment } from "../api/pay"
import { getListUserPayment } from "../api/user"
import { useBillingStore, useSettingsStore } from "../store"
import Modal from "./modal"

export function BillingDialog() {
  const [
    billingModalVisible,
    setBillingModalVisible,
    getPayableQuotas,
    payableQuotas,
    getUserQuotaInfo,
  ] = useBillingStore((state) => [
    state.billingModalVisible,
    state.setBillingModalVisible,
    state.getPayableQuotas,
    state.payableQuotas,
    state.getUserQuotaInfo,
  ])
  const [payStatus, setPayStatus] = React.useState<number>(0) // 0：未创建订单，1:创建订单，暂时支付二维码 2：支付成功
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [paymentDetail, setPaymentDetail] = React.useState<any>({})
  const [user] = useSettingsStore((state) => [state.user])

  React.useEffect(() => {
    if (billingModalVisible) {
      setPayStatus(0)
      getPayableQuotas("chat")
      getListUserPaymentList()
    }
  }, [billingModalVisible])

  /**
   * loop查询支付状态
   */
  const loopQueryPayment = (id: string) => {
    const timer = setInterval(() => {
      getPayment(id).then((res) => {
        if (res.result.state === "paid") {
          setPayStatus(2)
          clearInterval(timer)
          // 购买成功后，刷新一下用户套餐信息
          getUserQuotaInfo(user.id)
        }
      })
    }, 3000)
  }

  /**
   * 支付
   * @param item
   */
  const handlePay = async (item: any) => {
    try {
      setIsLoading(true)
      const res = await createPayment({
        quota_type: item.quota_type,
        pricing: item.pricing,
      })
      setPaymentDetail(res.result)
      setPayStatus(1)
      loopQueryPayment(res.result.id)
    } catch (e) {
      setIsLoading(false)
    }
  }

  // 获取用户未付款的订单先展示
  const getListUserPaymentList = async () => {
    const res = await getListUserPayment(user.id)
    const recentPayment = res.result.filter(
      (item: Record<string, string>) => item.state === "pending"
    )[0]

    if (recentPayment) {
      setPaymentDetail(recentPayment)
      setPayStatus(1)
      loopQueryPayment(recentPayment.id)
    }
  }

  if (payStatus === 2) {
    return (
      <Modal
        show={billingModalVisible}
        size="sm"
        onClose={() => setBillingModalVisible(false)}
      >
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold">支付成功</h1>
          <svg
            className="w-16 h-16 text-green-600"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M501.009067 0C224.50176 0 0.395947 229.198507 0.395947 512s224.105813 512 500.626773 512c276.514133 0 500.619947-229.198507 500.619947-512S777.434453 0 501.015893 0z m-39.103147 732.99968L257.938773 514.300587l52.210347-44.305067L428.168533 567.405227c48.011947-60.299947 155.56608-180.599467 303.506774-276.39808l12.417706 30.399146c-135.816533 131.50208-247.186773 316.798293-282.187093 411.600214z"
              fill="currentcolor"
            ></path>
          </svg>
        </div>
      </Modal>
    )
  } else if (payStatus === 1) {
    return (
      <Modal
        show={billingModalVisible}
        size="sm"
        onClose={() => setBillingModalVisible(false)}
      >
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold">请扫码支付</h1>
          <img
            src={paymentDetail.context.qrcode}
            alt=""
            className="w-32 h-32"
          />
          <div>请使用微信扫码支付</div>
        </div>
      </Modal>
    )
  } else {
    return (
      <Modal
        show={billingModalVisible}
        size="lg"
        onClose={() => setBillingModalVisible(false)}
      >
        <div>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold">购买套餐</h1>
            <div className="flex gap-6 justify-evenly">
              {payableQuotas.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-6 border-2 border-blue-500 rounded-lg shadow"
                >
                  <div className="text-2xl font-bold">{item.title}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-blue-500">
                      {String(item.tokens_count).replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </span>
                    <span>Token</span>
                  </div>
                  <div className="text-xl font-semibold">￥{item.price}</div>

                  <button
                    className="w-full px-4 py-1 text-white bg-blue-500 hover:bg-blue-600 border-blue-600/70"
                    onClick={() => handlePay(item)}
                  >
                    购买
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
