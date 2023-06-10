import Link from "next/link"
import UserApi, { User } from "@/api/users"
import { BracesIcon, GiftIcon, MessageSquareIcon, MessagesSquareIcon, UsersIcon } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import useSWR from "swr"

import Loading from "../loading"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function UserStats({ user }: { user: User }) {
  const { data, isLoading } = useSWR("/user/stats", UserApi.getStats)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded border bg-white/80 text-xs text-muted-foreground shadow-sm">
          <div className="border-b p-1 font-bold">{label}</div>
          <div className="p-1">
            <div>{`消息数: ${payload[0].value}`}</div>
            <div>{`消耗 tokens: ${payload[1].value}`}</div>
          </div>
        </div>
      )
    }

    return null
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">消息</CardTitle>
            <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.messages.total}</div>
            <p className="text-xs text-muted-foreground">最近 30 天创建 {data.messages.recent_30days_total} 条消息</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">对话</CardTitle>
            <MessagesSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversations.total}</div>
            <p className="text-xs text-muted-foreground">
              最近 30 天创建 {data.conversations.recent_30days_total} 次对话
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens</CardTitle>
            <BracesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tokens.total}</div>
            <p className="text-xs text-muted-foreground">最近 30 天消耗了 {data.tokens.recent_30days_total} tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">邀请人数</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.invitations}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/invitations" className="flex items-center gap-1">
                <GiftIcon size={14} className="text-primary" />
                邀请好友，你和朋友都会获得奖励！
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">最近 30 天消息量趋势</CardTitle>
        </CardHeader>
        <CardContent className="text-primary-300">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              width={730}
              height={250}
              data={data.messages.recent_daily_count}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DDD6FE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9BBEF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Area type="monotone" dataKey="messages_count" stroke="#6D28D9" fillOpacity={1} fill="url(#colorUv)" />
              <Area type="monotone" dataKey="tokens_count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
