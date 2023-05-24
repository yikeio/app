import { useRouter } from "next/router"
import { updateConversation } from "@/api/conversations"
import Locale from "@/locales"
import { useActionsStore, useChatStore, useUserStore } from "@/store"
import {
  ChevronLeftIcon,
  Edit2,
  MenuIcon,
  MessageSquare,
  Share,
  Trash2,
} from "lucide-react"

import { Button } from "./ui/button"
import { Label } from "./ui/label"

export default function ChatHeader(props) {
  const { autoScrollBottomRef, toggleSidebar } = props
  const [session, currentIndex, updateCurrentSession, removeSession] =
    useChatStore((state) => [
      state.currentSession(),
      state.currentSessionIndex,
      state.updateCurrentSession,
      state.removeSession,
    ])

  const [user] = useUserStore((state) => [state.user])

  const [setMode] = useActionsStore((state) => [state.setMode])

  const router = useRouter()

  const switchMode = () => {
    autoScrollBottomRef.current = false
    setMode("select")
  }

  const handleBackToSessions = () => {
    setMode("normal")
    router.back()
  }

  // 更新对话
  const handleUpdate = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.title)
    if (newTopic && newTopic !== session.title) {
      updateCurrentSession((session) => {
        session.title = newTopic!
        updateConversation(session.id, { title: newTopic })
      })
    }
  }

  const handleDelete = () => {
    const result = confirm("确认删除当前会话？")
    if (result) {
      removeSession(currentIndex)
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-between overflow-hidden border-b bg-white p-2 md:px-6 md:py-4">
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <div className="shrink-0 md:hidden">
          <button
            className="flex items-center gap-1 p-2"
            title="返回对话历史"
            onClick={handleBackToSessions}
          >
            <ChevronLeftIcon size={22} />
          </button>
        </div>
        <div className="flex max-w-[45vw] items-center gap-2 overflow-hidden">
          <MessageSquare className="hidden shrink-0 text-gray-500 md:block" />
          <div className="truncate text-lg">{session.title}</div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-gray-500">
        {user.id && (
          <>
            <Button
              variant="outline"
              className="flex h-8 w-8 items-center justify-center p-1 shadow-sm"
              title="重命名"
              onClick={handleUpdate}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="flex h-8 w-8 items-center justify-center p-1 shadow-sm"
              onClick={switchMode}
            >
              <Share className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="flex h-8 w-8 items-center justify-center p-1 shadow-sm"
              title="删除对话"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
