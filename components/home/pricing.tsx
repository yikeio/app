import { useRouter } from "next/router"

import PricingTable from "../pricing-table"

export default function HomePricing() {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-20 rounded-xl">
      <a name="pricing"></a>
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-3xl lg:text-5xl">价格</h2>
        <div className="text-muted-foreground">
          我们提供更有竞争力的使用价格，让你能更以更低的价格获得最优质的生产力。
        </div>
      </div>
      <div>
        <PricingTable onClick={() => router.push("/pricing")} />
      </div>
    </div>
  )
}
