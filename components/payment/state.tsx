import { Payment } from "@/api/payments"

import { Button } from "../ui/button"

export default function PaymentState({
  payment,
  onClickToPay,
}: {
  payment: Payment
  onClickToPay: (payment: Payment) => void
}) {
  const className = "inline-block px-1 text-xs border rounded "
  switch (payment.state) {
    case "pending":
      return (
        <>
          <span className={className + "text-orange-500 bg-orange-100 border-orange-200"}>待支付</span>
          <Button variant="link" className="text-xs" size="sm" onClick={() => onClickToPay(payment)}>
            立即支付
          </Button>
        </>
      )
    case "expired":
      return <span className={className + "text-red-500 bg-red-100 border-red-200"}>已过期</span>
    case "paid":
      return <span className={className + "text-green-500 bg-green-100 border-green-200"}>已支付</span>
    default:
      return <span className={className}>未知</span>
  }
}
