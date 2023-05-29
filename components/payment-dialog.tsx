/* eslint-disable @next/next/no-img-element */
import * as React from "react"

import { getPayment } from "../api/pay"
import { useBillingStore, useUserStore } from "../store"
import Modal from "./modal"

export function PaymentDialog({ paymentDetail, onClose }) {
  const [getUserQuotaInfo] = useBillingStore((state) => [state.getUserQuotaInfo])
  const [payStatus, setPayStatus] = React.useState<number>(0) // 1:创建订单，暂时支付二维码 2：支付成功
  const [user] = useUserStore((state) => [state.user])
  const [timer, setTimer] = React.useState<any>(null)

  React.useEffect(() => {
    if (paymentDetail.id) {
      setPayStatus(1)
      loopQueryPayment(paymentDetail.id)
    } else {
      clearInterval(timer)
    }
  }, [paymentDetail])

  /**
   * loop查询支付状态
   */
  const loopQueryPayment = (id: string) => {
    const timer = setInterval(() => {
      getPayment(id).then((res) => {
        if (res.state === "paid") {
          setPayStatus(2)
          clearInterval(timer)
          // 购买成功后，刷新一下用户套餐信息
          getUserQuotaInfo(user.id)
        }
      })
    }, 3000)
    setTimer(timer)
  }

  if (paymentDetail.id) {
    return (
      <Modal
        show={true}
        closeOnClickMask={true}
        size="sm"
        onClose={() => {
          onClose()
        }}
      >
        {payStatus === 1 ? (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">请扫码支付</h1>
            <img src={paymentDetail.context.qrcode} alt="" className="h-32 w-32" />
            <div>请使用微信扫码支付</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">支付成功</h1>
            <svg
              className="h-16 w-16 text-green-600"
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
        )}
      </Modal>
    )
  }
  return null
}
