"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import { getLeaderboards, getReferrals } from "@/api/users"
import useAuth from "@/hooks/use-auth"
import { useUserStore } from "@/store"
import { copyToClipboard } from "@/utils"
import { Gift } from "lucide-react"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import { Layout } from "@/components/layout"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserCell from "@/components/user-cell"
import UserLayout from "./user/layout"

function FeatureHero({ code }) {
  const referUrl = `https://yike.io/?referrer=${code}`

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white p-2 shadow-sm xl:p-6">
      <img
        src="/background/gradient.svg"
        alt=""
        className="absolute inset-0 max-w-none"
      />
      <div className="absolute inset-0 bg-[url(/background/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-0 -mb-24 -mr-24 opacity-50">
        <Gift size={300} className="text-primary-500" />
      </div>

      <div className="relative flex flex-col gap-4 p-2 md:gap-6 md:p-4 xl:p-12">
        <div className="flex items-center gap-2 text-xl text-primary-500">
          <Gift />

          <span>邀请返现</span>
        </div>

        <h1 className="text-xl font-bold md:text-3xl">
          邀请好友，你和朋友都会获得奖励，
          <br />
          邀请越多返利比例越高！
        </h1>

        <div className="flex flex-col gap-6 text-primary-500 xl:flex-row">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm md:h-12 md:w-12 md:text-xl">
              1
            </div>
            <div className="max-w-[240px] text-gray-700">
              通过分享聊天记录，或者复制专属邀请链接，发送给朋友。
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm md:h-12 md:w-12 md:text-xl">
              2
            </div>
            <div className="max-w-[240px] text-gray-700">
              他们通过链接加入，并完成任意套餐支付。
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm md:h-12 md:w-12 md:text-xl">
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
              className="w-64 bg-primary-200/60 border-primary-300 px-3 py-1"
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
  const { user, hasLogged } = useAuth()

  useEffect(() => {
    if (!hasLogged || !user) {
      return
    }

    getReferrals(user.id).then((res) => {
      setReferrals(res || [])
    })

    getLeaderboards().then((res) => {
      setLeaderboards(res || [])
    })
  }, [hasLogged, user])

  if (!hasLogged || !user) {
    return <Loading />
  }

  return (
    <Layout>
      <div className="h-full overflow-auto p-4 md:p-8">
        <FeatureHero code={user.referral_code} />
        <div className="mt-4">
          <Tabs defaultValue="leaderboard">
            <TabsList className="grid grid-cols-2 bg-primary-50 md:inline-grid">
              <TabsTrigger value="invitations">
                我的邀请记录（{referrals.length}）
              </TabsTrigger>
              <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
            </TabsList>
            <TabsContent
              value="invitations"
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <table className="my-0 w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                  <tr>
                    <td className="border-none">用户</td>
                    <td className="border-none">注册时间</td>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="border-t text-sm text-gray-500"
                    >
                      <td className="border-none px-4 py-3">
                        <UserCell user={referral} />
                      </td>
                      <td className="border-none px-4 py-3">
                        {formatDatetime(referral.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {referrals.length <= 0 && (
                <EmptyState className="min-h-[100px]" />
              )}
            </TabsContent>
            <TabsContent
              value="leaderboard"
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <table className="my-0 w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                  <tr>
                    <td className="border-none">排名</td>
                    <td className="border-none">用户</td>
                    <td className="border-none">已邀请用户数</td>
                  </tr>
                </thead>
                <tbody>
                  {leaderboards.map((user, i) => (
                    <tr
                      key={user.id}
                      className="border-t text-sm text-gray-500"
                    >
                      <td className="border-none">{i + 1}</td>
                      <td className="border-none px-4 py-3">
                        <UserCell user={user} />
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
    </Layout>
  )
}
