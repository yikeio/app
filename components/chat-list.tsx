import { use, useRef, useState } from "react"
import { useRouter } from "next/router"
import { getConversationList } from "@/api/conversations"
import {
  ChatSession,
  useBillingStore,
  useChatStore,
  useUserStore,
} from "@/store"
import { isMobileScreen } from "@/utils"
import { MessageSquareIcon, PlusIcon, TrashIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import Locale from "../locales"
import SecondMenubar from "./second-menubar"
import { Label } from "./ui/label"

export function ChatItem(props: {
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
      className={` group relative rounded-lg border p-4 shadow-sm ${
        props.selected
          ? "border-2 border-primary shadow-none"
          : "border-slate-200"
      }`}
      onClick={props.onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <MessageSquareIcon size={16} className="flex-shink-0" />
          <div className="truncate text-gray-700">{props.title}</div>
        </div>
        <div className="flex h-6 shrink-0 items-center text-gray-500">
          <div className="text-xs group-hover:hidden">{props.count} 条对话</div>
          {props.id > 0 && !isMobileScreen() && (
            <div
              className="hidden cursor-pointer rounded p-1 text-red-500 transition-all hover:bg-red-200 group-hover:block"
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

export function ChatList() {
  const [
    sessions,
    currentIndex,
    conversationPager,
    createConversation,
    selectSession,
    removeSession,
  ] = useChatStore((state) => [
    state.sessions,
    state.currentSessionIndex,
    state.conversationPager,
    state.createConversation,
    state.selectSession,
    state.removeSession,
  ])

  const [currentCombo] = useBillingStore((state) => [state.currentCombo])
  const [user, setLoginModalVisible] = useUserStore((state) => [
    state.user,
    state.setLoginModalVisible,
  ])

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const chatListRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleCreateConversation = () => {
    if (!user.id) {
      setLoginModalVisible(true)
      return
    }
    if (!currentCombo.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      location.href = "/pricing"
      return
    }
    createConversation()
    router.push({ hash: "hide-nav" })
  }

  const handleSelectSession = (index: number) => {
    selectSession(index)
    router.push({ hash: "hide-nav" })
  }

  // 懒加载会话列表
  const handleSideBarScroll = async () => {
    if (!chatListRef.current || !conversationPager) return

    const { scrollTop, clientHeight, scrollHeight } = chatListRef.current
    if (scrollHeight - clientHeight === scrollTop) {
      if (conversationPager.currentPage < conversationPager.lastPage) {
        try {
          setIsLoadingMore(true)
          const params = {
            page: conversationPager.currentPage + 1,
            pageSize: conversationPager.pageSize,
          }
          const conversationRes = await getConversationList(user.id, params)
          const list: ChatSession[] = conversationRes.result.data
          const newList: ChatSession[] = [
            ...sessions,
            ...list.map((conversation) => {
              conversation.messages = []
              conversation.updated_at = new Date(
                conversation.updated_at
              ).toLocaleString()
              return conversation
            }),
          ]

          // update pager
          useChatStore.setState({
            sessions: newList,
            conversationPager: {
              currentPage: conversationRes.result.current_page,
              pageSize: conversationRes.result.per_page,
              lastPage: conversationRes.result.last_page,
            },
          })

          setIsLoadingMore(false)
        } catch (e) {
          setIsLoadingMore(false)
        }
      }
    }
  }

  return (
    <SecondMenubar>
      <Label className="text-gray-500">会话历史({sessions.length})</Label>
      <div
        ref={chatListRef}
        className="flex h-auto flex-1 flex-col gap-4 overflow-y-auto"
        onScroll={handleSideBarScroll}
      >
        <div className="flex flex-col gap-4 pb-4">
          {sessions.map((item, i) => (
            <ChatItem
              id={item.id}
              title={item.title}
              time={item.updated_at}
              count={item.messages_count || item.messages.length || 1}
              key={item.id}
              selected={i === currentIndex}
              onClick={() => handleSelectSession(i)}
              onDelete={(e) => {
                e.stopPropagation()
                if (!isMobileScreen() || confirm("删除该对话")) {
                  removeSession(i)
                }
              }}
            />
          ))}
        </div>
        {isLoadingMore && <div className="animate-spin"></div>}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          className="flex w-full items-center justify-center gap-2"
          onClick={handleCreateConversation}
        >
          <PlusIcon size={22} />
          <span>开启新的会话</span>
        </Button>
      </div>
    </SecondMenubar>
  )
}
