import ConversationApi, { Conversation } from "@/api/conversations"
import { User } from "@/api/users"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { Card } from "../ui/card"

export default function UserConversations({ user }: { user: User }) {
  const { data: conversations, isLoading } = useSWR("/api/conversations:users", ConversationApi.list)

  if (isLoading) {
    return <Loading />
  }

  return (
    <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
      <table className="my-0 w-full min-w-max text-left text-sm ">
        <thead className="text-sm font-bold uppercase">
          <tr>
            <td className="border-none px-4 py-3">标题</td>
            <td className="border-none px-4 py-3">场景</td>
            <td className="border-none px-4 py-3">消息数</td>
            <td className="border-none px-4 py-3">使用的 tokens</td>
            <td className="border-none px-4 py-3">最后使用</td>
            <td className="border-none px-4 py-3">注册时间</td>
          </tr>
        </thead>
        <tbody>
          {conversations.data?.map((item: Conversation) => (
            <tr key={item.id} className="border-t text-sm">
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
