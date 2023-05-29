import { useRouter } from "next/router"
import { updateConversation } from "@/api/conversations"
import Locale from "@/locales"
import { useActionsStore, useChatStore, useUserStore } from "@/store"
import { Edit2, PanelRightIcon, Share, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import BackButton from "../head/back-button"
import LogoButton from "../head/logo-button"

export default function ChatHeader(props) {
  const { autoScrollBottomRef } = props
  const [session, currentIndex, updateCurrentSession, removeSession] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
    state.updateCurrentSession,
    state.removeSession,
  ])

  const [user] = useUserStore((state) => [state.user])
  const [setMode] = useActionsStore((state) => [state.setMode])

  const switchMode = () => {
    autoScrollBottomRef.current = false
    setMode("select")
  }

  const handleToggleSidebar = () => {
    //todo:
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
    <div className="flex shrink-0 items-center justify-between overflow-hidden border-b bg-white">
      <LogoButton />
      <div className="flex flex-1 gap-6 border-l p-2 md:p-4">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <BackButton />
          <div className="max-w-[45vw] truncate text-lg ">{session.title}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-gray-500">
          {user.id && (
            <>
              <Button
                variant="outline"
                className="flex h-8 w-8 items-center justify-center p-1"
                title="重命名"
                onClick={handleUpdate}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="flex h-8 w-8 items-center justify-center p-1" onClick={switchMode}>
                <Share className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="flex h-8 w-8 items-center justify-center p-1"
                title="删除对话"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="flex h-8 w-8 items-center justify-center p-1"
                title="打开/关闭边栏"
                onClick={handleToggleSidebar}
              >
                <PanelRightIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
