"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import useAuth from "@/hooks/use-auth"
import { useQueryState } from "@/hooks/user-query-state"
import { TabsContent } from "@radix-ui/react-tabs"
import { ChevronLeftIcon } from "lucide-react"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import Loading from "@/components/loading"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserChats from "@/components/user/chats"
import UserInvitations from "@/components/user/invitations"
import UserPayments from "@/components/user/payments"
import UserProfile from "@/components/user/profile"
import UserStats from "@/components/user/stats"
import UserCenterHeading from "../components/user/heading"

export default function UserPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tab, setTab] = useQueryState("tab", { defaultValue: "stats" })

  useEffect(() => {
    setTab((router.query.tab as unknown as string) || "stats")
  }, [router.query.tab, setTab])

  if (!user) {
    return <Loading />
  }

  return (
    <Layout>
      <Head title="用户中心" />
      <main className="h-screen flex-1 overflow-auto">
        <div className="flex h-12 items-center justify-between border-b bg-white px-4 md:hidden">
          <button className="flex items-center gap-1 p-2" title="返回" onClick={() => router.back()}>
            <ChevronLeftIcon size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-6 p-4 lg:p-12 ">
          <UserCenterHeading user={user} />
          <Tabs className="w-full" defaultValue={tab} value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-5 bg-primary-50 md:inline-grid">
              <TabsTrigger value="stats">数据统计</TabsTrigger>
              <TabsTrigger value="profile">个人资料</TabsTrigger>
              <TabsTrigger value="payments">我的订单</TabsTrigger>
              <TabsTrigger value="invitations">我的邀请</TabsTrigger>
              <TabsTrigger value="chats">对话历史</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="py-6">
              <UserStats user={user} />
            </TabsContent>
            <TabsContent value="profile" className="py-6">
              <UserProfile user={user} />
            </TabsContent>
            <TabsContent value="payments" className="py-6">
              <UserPayments user={user} />
            </TabsContent>
            <TabsContent value="invitations" className="py-6">
              <UserInvitations user={user} />
            </TabsContent>
            <TabsContent value="chats" className="py-6">
              <UserChats user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  )
}
