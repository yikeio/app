import { updateConversation } from "@/api/conversations"
import Locale from "@/locales"
import { useChatStore, useActionsStore } from "@/store"
import { Edit2, FileDown, MessageSquare, Share2, Trash2 } from "lucide-react"

import { Icons } from "@/components/icons"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

export default function ChatHeader(props) {
  const [session, currentIndex, updateCurrentSession, removeSession] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
    state.updateCurrentSession,
    state.removeSession,
  ])

  const [setMode] = useActionsStore(state => [state.setMode])

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
    const result = confirm('确认删除？')
    if (result) {
      removeSession(currentIndex)
    }
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div
        className="items-center gap-4 md:flex"
        onClick={() => props.toggleSidebar?.()}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="text-gray-500" />
          <Label className="text-lg">{session.title}</Label>
        </div>
        <div className="text-sm text-gray-400"></div>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <div className="md:hidden">
          <button
            className="flex items-center gap-1 p-2"
            title={Locale.Chat.Actions.ChatList}
            onClick={() => props.toggleSidebar?.()}
          >
            <Icons.menu size={22} />
            <span>会话列表</span>
          </button>
        </div>

        <Button
          variant="outline"
          className="flex items-center justify-center w-8 h-8 p-1"
          title="重命名"
          onClick={handleUpdate}
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        {/* 导出聊天内容 */}
        <Button
          variant="outline"
          className="flex items-center justify-center w-8 h-8 p-1"
          onClick={() => setMode('select')}
        >
          <FileDown className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center w-8 h-8 p-1"
          onClick={() => null} // 分享图片？
        >
          <Share2 className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          className="flex items-center justify-center w-8 h-8 p-1"
          title="重命名"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
