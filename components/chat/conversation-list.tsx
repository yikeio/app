import { useState } from "react"
import { useRouter } from "next/router"
import { Conversation, createConversation } from "@/api/conversations"
import { User } from "@/api/users"
import { useBillingStore } from "@/store"
import { isMobileScreen } from "@/utils"
import { MessageSquareIcon, PlusIcon, TrashIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"

export function ConversationItem(props: {
  onClick?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  title: string
  count: number
  time: string
  selected: boolean
  id: number
}) {
  return (
    <div
      className={` group relative rounded-lg border p-2 px-4 ${
        props.selected ? "border-primary bg-gray-50 shadow-none" : "border-slate-200"
      }`}
      onClick={props.onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-gray-600">
          <div className="truncate">{props.title}</div>
        </div>
        <div className="flex h-6 shrink-0 items-center text-gray-500">
          <div className="text-xs group-hover:hidden">{props.count} 条对话</div>
          {props.id > 0 && !isMobileScreen() && (
            <div
              className="hidden cursor-pointer rounded p-1 text-primary-500 transition-all hover:bg-primary-200 group-hover:block"
              onClick={props.onDelete}
            >
              <TrashIcon size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ConversationList({
  user,
  conversations,
  onSelect = (conversation: Conversation) => {},
  onDelete = (conversation: Conversation) => {},
}: {
  user: User
  onSelect?: (conversation: Conversation) => void
  onDelete?: (conversation: Conversation) => void
  conversations: Conversation[]
}) {
  const [currentPlan] = useBillingStore((state) => [state.currentQuota])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selected, setSelected] = useState<Conversation | null>(null)

  const handleCreateConversation = () => {
    if (!currentPlan.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      location.href = "/pricing"
      return
    }

    createConversation("新对话")
  }

  const handleSelect = (conversation: Conversation) => {
    setSelected(conversation)
    onSelect(conversation)
  }

  const handleDelete = (conversation: Conversation) => {
    if (confirm("删除该对话")) {
      onDelete(conversation)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-auto flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {conversations.map((item) => (
            <ConversationItem
              id={item.id}
              title={item.title}
              time={item.updated_at}
              count={item.messages_count || 1}
              key={item.id}
              selected={item.id === selected?.id}
              onClick={() => handleSelect(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
        {isLoadingMore && <div className="animate-spin"></div>}
      </div>

      <div className="flex flex-col gap-4">
        <Button className="flex w-full items-center justify-center gap-2" onClick={handleCreateConversation}>
          <PlusIcon size={22} />
          <span>开启新的对话</span>
        </Button>
      </div>
    </div>
  )
}
