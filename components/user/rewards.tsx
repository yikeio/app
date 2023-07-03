import { useState } from "react"
import UserApi, { Reward, User } from "@/api/users"
import { GiftIcon } from "lucide-react"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import GroupQrcode from "../group-qrcode"
import Loading from "../loading"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import UserCell from "./cell"

export default function UserRewards({ user }: { user: User }) {
  const [pageIndex, setPageIndex] = useState(1)
  const { data: rewards, isLoading } = useSWR([`/api/users:rewards?page=${pageIndex}`, pageIndex], ([_, page]) => {
    return UserApi.getRewards(page || 1)
  })

  if ((isLoading && pageIndex === 0) || !rewards) {
    return <Loading />
  }

  return (
    <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
      <div className="my-4">
        <div className="flex items-center gap-2">
          <GiftIcon />
          <h3 className="text-lg font-bold ">我的收益共 ￥{user.rewards_total}</h3>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>（待提现 ￥{user.unwithdrawn_rewards_total}）</TooltipTrigger>
                <TooltipContent>
                  <div className="my-4">请扫描用户群二维码联系群主提现</div>
                  <GroupQrcode />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <table className="my-0 w-full min-w-max text-left text-sm">
        <thead className="text-sm font-bold uppercase">
          <tr>
            <td className="py-2 px-4 border-none">收益来源</td>
            <td className="py-2 px-4 border-none">获得奖励</td>
            <td className="py-2 px-4 border-none">获得时间</td>
          </tr>
        </thead>
        <tbody>
          {rewards.data.map((reward: Reward) => (
            <tr key={reward.id} className="border-t text-sm">
              <td className="border-none px-4 py-3">
                <UserCell user={reward.from_user} />
              </td>
              <td className="border-none px-4 py-3">+￥{reward.amount}</td>
              <td className="border-none px-4 py-3">{formatDatetime(reward.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageIndex === 1 && rewards.data.length <= 0 && <EmptyState className="min-h-[100px]" />}
      <div className="mt-6 flex items-center gap-6">
        {pageIndex > 1 && (
          <Button variant="outline" onClick={() => setPageIndex(pageIndex - 1)}>
            上一页
          </Button>
        )}
        {rewards.total > 0 && rewards.last_page > pageIndex && (
          <Button variant="outline" onClick={() => setPageIndex(pageIndex + 1)}>
            下一页
          </Button>
        )}
      </div>
    </Card>
  )
}
