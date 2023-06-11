import { useRouter } from "next/router"

import PricingTable from "../pricing-table"

export default function HomePricing() {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-20 rounded-xl">
      <a name="pricing"></a>
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-3xl lg:text-5xl">价格</h2>
        <div>我们正在持续完善打磨产品，努力提供一个更完善的生产力工具。</div>
      </div>
      <div>
        <PricingTable onClick={() => router.push("/pricing")} />
      </div>
    </div>
  )
}
