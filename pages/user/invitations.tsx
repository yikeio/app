/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { getLeaderboards, getReferrals } from "@/api/user"
import { useUserStore } from "@/store"
import { copyToClipboard } from "@/utils"
import { Gift } from "lucide-react"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserLayout from "./layout"

function FeatureHero({ code }) {
  const referUrl = `https://yike.io/?referrer=${code}`

  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow">
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
          <div className="inline-flex items-center gap-2">
            <Input
              type="text"
              className="w-64 bg-slate-200 px-3 py-1"
              value={referUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button className="block" onClick={() => copyToClipboard(referUrl)}>
              复制
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserInvitationPage() {
  const [referrals, setReferrals] = useState([])
  const [leaderboards, setLeaderboards] = useState([])
  const [user] = useUserStore((state) => [state.user])

  useEffect(() => {
    if (!user.id) return
    getReferrals(user.id).then((res) => {
      setReferrals(res.result || [])
    })

    getLeaderboards().then((res) => {
      setLeaderboards(res.result || [])
    })
  }, [user])

  return (
    <UserLayout>
      <div className="h-full bg-slate-50 p-8">
        <FeatureHero code={user.referral_code} />
        <div className="mt-4">
          <Tabs defaultValue="leaderboard">
            <TabsList className="inline-grid grid-cols-2">
              <TabsTrigger value="invitations">
                我的邀请记录（{referrals.length}）
              </TabsTrigger>
              <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
            </TabsList>
            <TabsContent value="invitations" className="bg-white p-6">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                  <td className="border-none">用户</td>
                  <td className="border-none">注册时间</td>
                  {/* <td className="border-none">获得奖励</td> */}
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="flex items-center border-t text-sm text-gray-500"
                    >
                      <td className="border-none px-4 py-3">{referral.name}</td>
                      <td className="border-none px-4 py-3">
                        {formatDatetime(referral.created_at)}
                      </td>
                      {/* <td className="border-none px-4 py-3">
                      {referral.has_paid ? referral.referrals_count : "未支付"}
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {referrals.length <= 0 && (
                <EmptyState className="min-h-[100px]" />
              )}
            </TabsContent>
            <TabsContent value="leaderboard" className="bg-white p-6">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                  <td className="border-none">排名</td>
                  <td className="border-none">用户</td>
                  <td className="border-none">注册时间</td>
                  <td className="border-none">已邀请用户数</td>
                </thead>
                <tbody>
                  {leaderboards.map((user, i) => (
                    <tr
                      key={user.id}
                      className="border-t text-sm text-gray-500"
                    >
                      <td className="border-none">{i + 1}</td>
                      <td className="border-none px-4 py-3">{user.name}</td>
                      <td className="border-none px-4 py-3">
                        {formatDatetime(user.created_at)}
                      </td>
                      <td className="border-none px-4 py-3">
                        {user.referrals_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leaderboards.length <= 0 && (
                <EmptyState className="min-h-[100px]" />
              )}
              {leaderboards.length >= 100 && (
                <div className="text-sm text-gray-400">
                  * 仅显示榜单前 100 名用户
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UserLayout>
  )
}
