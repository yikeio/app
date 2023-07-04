import { useState } from "react"
import { Conversation } from "@/api/conversations"
import { TrashIcon } from "lucide-react"

import { cn, isMobileScreen } from "@/lib/utils"
import EmptyState from "../empty-state"

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
      className={` group relative rounded-lg border bg-background p-2 px-4 ${
        props.selected
          ? "border-primary text-foreground bg-primary-50 shadow-none dark:bg-background"
          : "border-slate-200 dark:border-muted"
      }`}
      onClick={props.onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-muted-foreground">
          <div className="truncate text-sm">{props.title}</div>
        </div>
        <div className="flex h-6 shrink-0 items-center text-muted-foreground">
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
  conversations,
  className = "",
  onSelect = (conversation: Conversation) => {},
  onDelete = (conversation: Conversation) => {},
  selectedId = 0,
}: {
  className?: string
  conversations: Conversation[]
  isStreaming?: boolean
  streamContent?: string
  selectedId?: number
  onSelect?: (conversation: Conversation) => void
  onDelete?: (conversation: Conversation) => void
}) {
  const [isLoadingMore] = useState(false)
  const [selected, setSelected] = useState<Conversation | null>(
    selectedId ? conversations.find((item) => item.id === selectedId) : null
  )

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
    <div className={cn("flex h-full flex-1 flex-col gap-4 overflow-y-auto", className)}>
      {conversations.length <= 0 && <EmptyState />}
      {isLoadingMore && <div className="animate-spin"></div>}
      <div className="flex flex-col gap-4">
        {conversations.map((item) => (
          <ConversationItem
            id={item.id}
            title={item.title}
            time={item.updated_at}
            count={item.messages_count || 0}
            key={item.id}
            selected={item.id === selected?.id}
            onClick={() => handleSelect(item)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>
    </div>
  )
}
