"use client"

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import UserApi, { User } from "@/api/users"
import useAuth from "@/hooks/use-auth"
import { ArrowRightIcon, Gift, GiftIcon } from "lucide-react"

import EmptyState from "@/components/empty-state"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserCell from "@/components/user/cell"
import UserInvitations from "@/components/user/invitations"
import UserReferralLink from "@/components/user/referral-link"

function FeatureHero({ user = null }: { user?: User }) {
  const { redirectToLogin } = useAuth()

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white text-foreground shadow-sm dark:bg-background">
      <img src="/background/gradient.svg" alt="" className="absolute inset-0 max-w-none" />
      <div className="absolute inset-0 bg-[url(/background/grid.svg)] bg-center"></div>
      <div className="absolute bottom-0 right-0 -mb-24 -mr-24 opacity-10 md:opacity-50">
        <GiftIcon size={300} className="text-primary-500" />
      </div>

      <div className="relative flex flex-col gap-4 p-4 md:gap-6 md:p-4 xl:p-12">
        <div className="flex items-center gap-2 text-xl text-primary-500">
          <Gift />

          <span>邀请返现</span>
        </div>

        <h1 className="text-xl font-bold md:text-3xl">
          邀请好友，你和朋友都会获得奖励，
          <br />
          邀请越多返利比例越高！
        </h1>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm text-primary-500 md:h-12 md:w-12 md:text-xl">
              1
            </div>
            <div className="max-w-[240px] text-muted-foreground">
              通过分享聊天记录，或者复制专属邀请链接，发送给朋友。
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm text-primary-500 md:h-12 md:w-12 md:text-xl">
              2
            </div>
            <div className="max-w-[240px] text-muted-foreground">他们通过链接加入，并完成任意套餐支付。</div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-sm text-primary-500 md:h-12 md:w-12 md:text-xl">
              3
            </div>
            <div className="max-w-[240px] text-muted-foreground">你和对方都将获得一定比例的返利。</div>
          </div>
        </div>

        {user && (
          <div className="flex flex-col gap-2">
            <div className="text-foreground">我的专属邀请链接：</div>
            <UserReferralLink user={user} />
          </div>
        )}

        {!user && (
          <>
            <Button className="flex w-fit items-center gap-4" onClick={redirectToLogin}>
              <ArrowRightIcon size={16} />
              <span>立即登录，赚取高达 10% 返现！</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function UserInvitationPage() {
  const [leaderboards, setLeaderboards] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      return
    }
    UserApi.getLeaderboards().then((res) => {
      setLeaderboards(res)
    })
  }, [user])

  return (
    <Layout>
      <div className="h-full overflow-auto p-4 sm:p-6 md:p-8">
        <FeatureHero user={user} />
        {user && (
          <div className="mt-4">
            <Tabs defaultValue="leaderboard">
              <TabsList className="grid grid-cols-2 bg-primary-50 dark:bg-muted md:inline-grid">
                <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
                <TabsTrigger value="invitations">我的邀请记录</TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="rounded-lg border p-6 shadow-sm">
                <table className="my-0 w-full text-left text-sm ">
                  <thead className="text-sm font-bold uppercase ">
                    <tr>
                      <td className="w-14 border-none md:w-auto">排名</td>
                      <td className="border-none">用户</td>
                      <td className="w-12 border-none md:w-auto">已邀请用户数</td>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboards.map((user, i) => (
                      <tr key={user.id} className="border-t text-sm ">
                        <td className="border-none">{i + 1}</td>
                        <td className="border-none px-4 py-3">
                          <UserCell user={user} />
                        </td>
                        <td className="border-none px-4 py-3">{user.referrals_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leaderboards.length <= 0 && <EmptyState className="min-h-[100px]" />}
                {leaderboards.length >= 100 && (
                  <div className="text-sm text-muted-foreground">* 仅显示榜单前 100 名用户</div>
                )}
              </TabsContent>

              <TabsContent value="invitations">
                <UserInvitations user={user} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  )
}
