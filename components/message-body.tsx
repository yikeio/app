import { useEffect } from "react"
import dynamic from "next/dynamic"
import { Message, useChatStore, useSettingsStore } from "@/store"

import { Icons } from "@/components/icons"
import MessageActions from "./message-actions"
import LoadingIcon from "../icons/loading.svg"

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

export default function MessageBody({ message, inputRef }) {
  const isUser = message.role === "user"

  const [session, isLoadingAnswer, setIsLoadingAnswer] = useChatStore(
    (state) => [
      state.currentSession(),
      state.isLoadingAnswer,
      state.setIsLoadingAnswer,
    ]
  )
  const [config] = useSettingsStore((state) => [state.config])

  // 请求消息时打字 loading
  useEffect(() => {
    if (!isLoadingAnswer) return
    session.messages.concat([LOADING_MESSAGE])
  }, [isLoadingAnswer, session.messages])

  const onRightClick = (e: any, message: Message) => {
    e.preventDefault()
    // 多选逻辑
  }

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
              onContextMenu={(e) => onRightClick(e, message)}
            >
              <Markdown content={message.content} />
            </div>
          )}
        </div>
      </div>
      <MessageActions message={message} inputRef={inputRef} />
    </div>
  )
}
