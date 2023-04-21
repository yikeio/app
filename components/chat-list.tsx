import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { getConversationList } from "@/api/conversations"
import {
  ChatSession,
  useBillingStore,
  useChatStore,
  useUserStore,
} from "@/store"
import { isMobileScreen } from "@/utils"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import Locale from "../locales"

export function ChatItem(props: {
  onClick?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  title: string
  count: number
  time: string
  selected: boolean
  id: string
}) {
  return (
    <div
      className={` border p-2 px-4 rounded-lg relative group ${
        props.selected ? "border-blue-500" : "border-slate-200"
      }`}
      onClick={props.onClick}
    >
      <Label className="text-gray-700">{props.title}</Label>
      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-500">
          {Locale.ChatItem.ChatItemCount(props.count)}
        </div>
        <div className="text-gray-400 ">{props.time}</div>
      </div>
      {props.id === "-1" ? (
        ""
      ) : (
        <div
          className="absolute top-0 right-0 p-1 m-2 text-red-500 transition-all rounded-full opacity-0 cursor-pointer group-hover:bg-red-200 group-hover:opacity-100"
          onClick={props.onDelete}
        >
          <Icons.trash size={14} />
        </div>
      )}
    </div>
  )
}

export function ChatList({
  showSideBar,
  toggleSidebar,
}: {
  showSideBar: boolean
  toggleSidebar: () => void
}) {
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

  const [currentCombo, setActivateVisible, setBillingModalVisible] =
    useBillingStore((state) => [
      state.currentCombo,
      state.setActivateVisible,
      state.setBillingModalVisible,
    ])
  const [user] = useUserStore((state) => [state.user])

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const chatListRef = useRef<HTMLDivElement>(null)

  const handleCreateConversation = () => {
    if (user.state === "unactivated") {
      toast.error("账号未激活，请先激活!")
      setActivateVisible(true)
      return
    }
    if (!currentCombo.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      setBillingModalVisible(true)
      return
    }
    createConversation()
    toggleSidebar()
  }

  // 懒加载会话列表
  const handleSideBarScroll = async () => {
    if (!chatListRef.current || !conversationPager) return

    const { scrollTop, clientHeight, scrollHeight } = chatListRef.current
    if (scrollHeight - clientHeight >= scrollTop) {
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
    <div
      className={
        `fixed md:relative bg-white border-r inset-0 w-full shrink-0 md:w-72 md:max-w-sm z-10 p-6 flex flex-col gap-6 h-screen ` +
        (showSideBar ? "left-0" : "-left-[100%] md:left-0")
      }
    >
      <Label className="text-gray-500">会话历史({sessions.length})</Label>
      <div
        ref={chatListRef}
        className="flex flex-col flex-1 gap-4 h-auto overflow-y-auto"
        onClick={() => toggleSidebar()}
        onScroll={handleSideBarScroll}
      >
        <div>
          <div className="flex flex-col gap-4 pb-4">
            {sessions.map((item, i) => (
              <ChatItem
                id={item.id}
                title={item.title}
                time={item.updated_at}
                count={item.messages_count || item.messages.length || 0}
                key={i}
                selected={i === currentIndex}
                onClick={() => selectSession(i)}
                onDelete={(e) => {
                  e.stopPropagation()
                  if (!isMobileScreen() || confirm(Locale.Home.DeleteChat)) {
                    removeSession(i)
                  }
                }}
              />
            ))}
          </div>
        </div>
        {isLoadingMore && <div className="animate-spin"></div>}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          className="flex items-center justify-center w-full p-2 px-4 text-white bg-red-500 border-red-400 md:hidden"
          onClick={() => {
            if (confirm(Locale.Home.DeleteChat)) {
              removeSession(currentIndex)
            }
          }}
        >
          <Icons.trash size={22} />
          <span>删除选中会话</span>
        </Button>
        <Button
          className="flex items-center justify-center w-full gap-2"
          onClick={handleCreateConversation}
        >
          <Icons.plus size={22} />
          <span>开启新的会话</span>
        </Button>
      </div>
    </div>
  )
}
