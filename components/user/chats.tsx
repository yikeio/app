import ConversationApi, { Conversation } from "@/api/conversations"
import { User } from "@/api/users"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { Card } from "../ui/card"

export default function UserChats({ user }: { user: User }) {
  const { data: conversations, isLoading } = useSWR("/api/conversations:users", ConversationApi.list)

  if (isLoading) {
    return <Loading />
  }

  return (
    <Card className="rounded-lg border bg-white p-6 shadow-sm">
      <table className="my-0 w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
          <tr>
            <td className="border-none">标题</td>
            <td className="border-none">场景</td>
            <td className="border-none">消息数</td>
            <td className="border-none">使用的 tokens</td>
            <td className="border-none">最后使用</td>
            <td className="border-none">注册时间</td>
          </tr>
        </thead>
        <tbody>
          {conversations.data?.map((item: Conversation) => (
            <tr key={item.id} className="border-t text-sm text-gray-500">
              <td className="border-none px-4 py-3">{item.title}</td>
              <td className="border-none px-4 py-3">{item.prompt?.name || "-"}</td>
              <td className="border-none px-4 py-3">{item.messages_count}</td>
              <td className="border-none px-4 py-3">{item.tokens_count}</td>
              <td className="border-none px-4 py-3">
                {item.last_active_at ? formatDatetime(item.last_active_at) : "-"}
              </td>
              <td className="border-none px-4 py-3">{formatDatetime(item.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {conversations.data?.length <= 0 && <EmptyState className="min-h-[100px]" />}
    </Card>
  )
}
