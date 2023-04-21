import { useEffect, useState } from "react"
import { getReferrals } from "@/api/user"
import { useUserStore } from "@/store"
import { Gift } from "lucide-react"

import EmptyState from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UserLayout from "./layout"

const FeatureHero = ({ code }) => (
  <div className="relative overflow-hidden rounded-lg bg-gray-50 shadow">
    <img
      src="/background/beams.jpg"
      alt=""
      className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
      width="1308"
    />
    <div className="absolute inset-0 bg-[url(/background/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

    <div className="relative flex flex-col gap-6 p-12">
      <div className="flex items-center gap-2 text-xl text-blue-500">
        <Gift />

        <span>邀请返现</span>
      </div>

      <h1 className="text-3xl font-bold">
        邀请好友，你和朋友都会获得奖励，
        <br />
        邀请越多返利比例越高！
      </h1>

      <div className="flex flex-col gap-6 text-blue-500 lg:flex-row">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl">
            1
          </div>
          <div className="max-w-[240px] text-gray-700">
            通过分享聊天记录，或者复制专属邀请链接，发送给朋友。
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl">
            2
          </div>
          <div className="max-w-[240px] text-gray-700">
            他们通过链接加入，并完成任意套餐支付。
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl">
            3
          </div>
          <div className="max-w-[240px] text-gray-700">
            你和对方都将获得一定比例的返利。
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-gray-700">我的专属邀请链接：</div>
        <div className="flex w-96 max-w-full items-center justify-between">
          <Input
            type="text"
            className="w-full rounded-lg bg-slate-200 px-4 py-2"
            value={`https://yike.io/?r=${code}`}
          />
          <Button
            variant="link"
            className="-ml-32 mr-4 bg-transparent p-1 text-blue-500"
          >
            复制
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export default function UserInvitationPage() {
  const [referrals, setReferrals] = useState([])
  const [user] = useUserStore((state) => [state.user])

  useEffect(() => {
    if (!user.id) return
    getReferrals(user.id).then((res) => {
      setReferrals(res.result.data || [])
    })
  }, [user])

  return (
    <UserLayout>
      <div className="p-8">
        <FeatureHero code={user.referral_code} />
        <div className="mt-4 space-y-4">
          <div>
            <Label>我的邀请记录</Label>
            <div className="flex items-center gap-4 text-sm text-gray-500 border-b py-4">
              <div className="w-1/3">用户</div>
              <div className="w-1/3">注册时间</div>
              <div className="w-1/3">获得奖励</div>
            </div>
          </div>
          {referrals.length <= 0 && <EmptyState className="min-h-[200px]" />}
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                {referral.name[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  )
}
