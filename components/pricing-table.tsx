import PaymentApi from "@/api/payments"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import useSWR from "swr"

import { cn, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function PricingTable({ onClick }: { onClick: (item: any) => void }) {
  const { data: plans, isLoading: isPlansLoading } = useSWR("/pricing", PaymentApi.plans)

  if (isPlansLoading) {
    return
  }

  return (
    <div className="-m-4 flex flex-wrap justify-center">
      {plans.map((item: any, index: number) => (
        <div className="w-full p-4 md:w-1/2 xl:w-1/4" key={index}>
          <div
            className={cn(
              `relative flex h-full flex-col overflow-hidden rounded-lg border border-primary-100 bg-primary-50 p-6 text-foreground shadow-sm hover:border-primary-300 hover:shadow-lg dark:border-primary-800 dark:bg-primary-900/10`,
              {
                "border-primary-500  hover:border-primary-600": item.is_popular,
              }
            )}
          >
            {item.is_popular && (
              <span className="absolute right-0 top-0 rounded-bl bg-primary px-3 py-1 text-xs tracking-widest text-white">
                POPULAR
              </span>
            )}
            <div className="title-font text-muted-forground mb-1 text-sm font-medium tracking-widest">{item.title}</div>
            <h1 className="text-forground mb-4 flex items-end border-b pb-4 text-4xl font-normal leading-none">
              <span>￥{item.price}</span>
              <span className="text-muted-forground ml-1 text-lg font-normal"> / {item.days}天</span>
            </h1>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>{item.days} 天使用期限</span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>{formatNumber(item.tokens_count)} tokens</span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>无限制预设角色使用</span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>实验室功能抢先体验</span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>API 访问能力</span>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={16} />
              <span>24 小时客户服务</span>
            </div>
            <Button disabled className="mt-6 justify-between" onClick={() => onClick(item)}>
              购买(已暂停)
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
