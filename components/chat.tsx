import { useCallback, useEffect, useRef, useState } from "react"
import classNames from 'classnames'
import dynamic from "next/dynamic"
import { updateConversation } from "@/api/conversations"
import Locale from "@/locales"
import {
  BOT_HELLO,
  Message,
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
import ChatFooter from "./chat-footer"
import ChatHeader from "./chat-header"

import { useLazyLoadMessage } from '@/hooks/use-lazy-load-message'
import { useMessageActions } from '@/hooks/use-message-actions'
import { usePrompt } from '@/hooks/use-prompt'

const LOADING_MESSAGE = {
  id: "loading",
  role: "assistant",
  content: "……",
  date: new Date().toLocaleString(),
  preview: true,
}

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <Icons.loading width={24} height={24} />,
})

type RenderMessage = Message & { preview?: boolean }

export function Chat(props: {
  showSideBar: boolean
  toggleSidebar: () => void
}) {
  const [
    session,
    sessionIndex,
    updateCurrentSession,
    onUserInput,
  ] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
    state.updateCurrentSession,
    state.onUserInput,
  ])

  const [user, config] = useSettingsStore((state) => [state.user, state.config])

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(false) // 正在输入loading

  const { chatBodyRef, isLoadingMessage, onChatBodyScroll, autoScrollBottomRef } = useLazyLoadMessage()
  const { onCopy, onResend, onRightClick } = useMessageActions({setIsLoading, onUserInput, inputRef, session});
  // TODO
  const { xxx } = usePrompt();
  

  // 请求消息时打字 loading
  useEffect(() => {
    if (isLoading) {
      session.messages.concat([LOADING_MESSAGE]);
    }
  }, [isLoading, session.messages]);

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

  const MessageActions = useCallback(({ message }) => {
    const isUser = message.role === "user"

    return (
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
                  onClick={() => onCopy(message)}
                >
                  <Icons.copy size={12} /> 复制
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onResend(message)}
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
    )
  }, []);

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
        <MessageActions message={message} />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-y-auto bg-slate-100">
      <ChatHeader toggleSidebar={props.toggleSidebar} />

      {/* 对话列表 */}
      <div
        className="flex flex-col flex-1 gap-2 p-6 overflow-y-auto"
        ref={chatBodyRef}
        onScroll={onChatBodyScroll}
        onTouchStart={() => inputRef.current?.blur()}
      >
        {isLoadingMessage && <div className="block animate-spin" />}
        {session.messages.map((message, index) => (
          <div
            key={message.id}
            className={classNames('flex flex-col-reverse md:flex-row items-start gap-2 md:gap-4', {
              'items-end md:items-start md:justify-end': message.role === "user",
              'items-start md:flex-row-reverse md:justify-end': message.role !== "user",
            })}
          >
            <MessageBody message={message} index={index} />
            <UserAvatar role={message.role} />
          </div>
        ))}
      </div>

      <ChatFooter
        showSideBar={props.showSideBar}
        autoScrollBottomRef={autoScrollBottomRef}
        setIsLoading={setIsLoading}
      />
    </div>
  )
}
