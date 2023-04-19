import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { updateConversation } from "@/api/conversations"
import Locale from "@/locales"
import {
  BOT_HELLO,
  Message,
  useBillingStore,
  useChatStore,
  useSettingsStore,
} from "@/store"
import {
  copyToClipboard,
  downloadAs,
  isMobileScreen,
  parseTime,
  selectOrCopy,
} from "@/utils"
import toast from "react-hot-toast"

import { UserAvatar } from "@/components/avatar"
import { Icons } from "@/components/icons"
import LoadingIcon from "../icons/loading.svg"
import { ControllerPool } from "../utils/requests"
// import ChatBody from './chat-body';
import ChatFooter from "./chat-footer"
import ChatHeader from "./chat-header"

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <Icons.loading width={24} height={24} />,
})

type RenderMessage = Message & { preview?: boolean }

export function Chat(props: {
  showSideBar: boolean
  toggleSidebar: () => void
}) {
  const [
    sessions,
    session,
    sessionIndex,
    messageHistoryPagerMap,
    getConversationHistory,
    updateCurrentSession,
    onUserInput,
  ] = useChatStore((state) => [
    state.sessions,
    state.currentSession(),
    state.currentSessionIndex,
    state.messageHistoryPagerMap,
    state.getConversationHistory,
    state.updateCurrentSession,
    state.onUserInput,
  ])
  const { id: currentSessionId } = session
  const pager = messageHistoryPagerMap.get(currentSessionId)

  const [user, config] = useSettingsStore((state) => [state.user, state.config])

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatBodyRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false) // 正在输入loading
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

  // 懒加载聊天内容
  const onChatBodyScroll = async (e: HTMLElement) => {
    if (e.scrollTop <= 0) {
      if (currentSessionId === "-1" || !pager) return
      if (pager?.currentPage < pager?.lastPage) {
        const params = {
          page: pager.currentPage + 1,
          pageSize: pager.pageSize,
        }

        try {
          setIsLoadingMessage(true)
          const prevMessages = await getConversationHistory(
            currentSessionId,
            params
          )
          updateCurrentSession((session) => {
            session.messages = [...prevMessages, ...session.messages]
          })
          chatBodyRef.current?.scrollTo({ top: 2250 })
          setIsLoadingMessage(false)
        } catch (e) {
          setIsLoadingMessage(false)
        }
      }
    }
  }

  // stop response
  const onUserStop = (messageIndex: number) => {
    ControllerPool.stop(sessionIndex, messageIndex)
  }

  const onRightClick = (e: any, message: Message, index: number) => {
    e.preventDefault()
    // 多选逻辑
  }

  const onResend = (botIndex: number) => {
    // find last user input message and resend
    for (let i = botIndex; i >= 0; i -= 1) {
      if (messages[i].role === "user") {
        setIsLoading(true)
        onUserInput(messages[i].content).then(() => setIsLoading(false))
        inputRef.current?.focus()
        return
      }
    }
  }

  if (
    session.context.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content &&
    pager?.currentPage === pager?.lastPage
  ) {
    session.context.push(BOT_HELLO)
  }

  // preview messages
  const messages: RenderMessage[] = useMemo(
    () =>
      session.context.concat(session.messages as RenderMessage[]).concat(
        isLoading
          ? [
              {
                id: "loading",
                role: "assistant",
                content: "……",
                date: new Date().toLocaleString(),
                preview: true,
              },
            ]
          : []
      ),
    [session.messages, session.context, isLoading]
  )

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

  // Auto focus
  useEffect(() => {
    if (props.showSideBar && isMobileScreen()) return
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const MessageBody = ({
    message,
    index,
  }: {
    message: RenderMessage
    index: number
  }) => {
    const isUser = message.role === "user"
    return (
      <div className="relative max-w-[90%] md:max-w-[75%] flex flex-col gap-2 overflow-hidden group">
        <div className="rounded-lg">
          <div
            className={
              `p-3 md:p-4 lg:p-5 xl:p-8 rounded-xl relative ` +
              (isUser
                ? "bg-blue-500 justify-self-end rounded-br-none text-white"
                : "bg-white rounded-bl-none text-gray-700")
            }
          >
            {/* 消息内容 */}
            {(message.preview || message.content.length === 0) && !isUser ? (
              <LoadingIcon />
            ) : (
              <div
                className="markdown-body "
                style={{ fontSize: `${config.chat_font_size}px` }}
                onContextMenu={(e) => onRightClick(e, message, index)}
              >
                <Markdown content={message.content} />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100">
          {!isUser && !message.preview && (
            <div className="text-xs text-gray-400">
              {parseTime(message.date.toLocaleString())}
            </div>
          )}

          {!isUser && !(message.preview || message.content.length === 0) && (
            // 工具栏
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {message.streaming ? (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onUserStop(index)}
                >
                  <Icons.copy size={12} /> 复制
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onResend(index)}
                >
                  <Icons.reload size={12} /> 重新生成
                </div>
              )}

              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => copyToClipboard(message.content)}
              >
                <Icons.copy size={12} /> 复制
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const MessageItem = useCallback(
    ({ message, index = 0 }: { message: RenderMessage; index?: number }) => {
      const isUser = message.role === "user"
      const messageBody = (
        <MessageBody
          key={`${message.id}_body`}
          message={message}
          index={index}
        />
      )
      const avatar = (
        <UserAvatar
          key={isUser ? "user_avatar" : "bot_avatar"}
          role={message.role}
        />
      )

      return (
        <div
          className={`flex flex-col md:flex-row items-start gap-2 md:gap-4 ${
            isUser ? "items-end md:items-start justify-end" : "items-start"
          }`}
        >
          {isUser && !isMobileScreen()
            ? [messageBody, avatar]
            : [avatar, messageBody]}
        </div>
      )
    },
    []
  )

  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-y-auto bg-slate-100">
      <ChatHeader toggleSidebar={props.toggleSidebar} />

      {/* 对话列表 */}
      <div
        className="flex flex-col flex-1 gap-2 p-6 overflow-y-auto"
        ref={chatBodyRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onTouchStart={() => inputRef.current?.blur()}
      >
        {isLoadingMessage && <div className="block animate-spin" />}
        {messages.map((message, i) => (
          <MessageItem key={message.id} message={message} index={i} />
        ))}
      </div>

      <ChatFooter
        showSideBar={props.showSideBar}
        chatBodyRef={chatBodyRef}
        setIsLoading={setIsLoading}
      />
    </div>
  )
}
