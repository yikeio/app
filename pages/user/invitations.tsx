import { useEffect, useState } from "react"
import { getReferrals as fetchReferrals } from "@/api/user"
import { Gift } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserLayout from "./layout"

export default function UserInvitationPage() {
  const [getReferrals, setReferrals] = useState([])

  useEffect(() => {
    fetchReferrals().then((res) => {
      setReferrals(res.data)
    })
  }, [])

  return (
    <UserLayout>
      <div className="relative m-12 overflow-hidden rounded-lg bg-gray-50 shadow">
        <img
          src="/background/beams.jpg"
          alt=""
          className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          width="1308"
        />
        <div className="absolute inset-0 bg-[url(/background/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="relative flex flex-col gap-6 p-12">
          <div className="flex items-center gap-2 text-xl text-gray-800">
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
                value="https://yike.io/?referrer=123456789"
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
      <div className="mt-4">
        {getReferrals.map((referral) => (
          <div key={referral.id} className="flex items-center gap-4 p-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white">
              {referral.name[0]}
            </div>
          </div>
        ))}
      </div>
    </UserLayout>
  )
}
