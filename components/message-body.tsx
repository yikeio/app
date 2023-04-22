import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useChatStore, useSettingsStore } from "@/store"

import { Icons } from "@/components/icons"
import LoadingIcon from "../icons/loading.svg"
import MessageActions from "./message-actions"

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

  const [session, isLoadingAnswer] = useChatStore((state) => [
    state.currentSession(),
    state.isLoadingAnswer,
  ])
  const [config] = useSettingsStore((state) => [state.config])

  // 请求消息时打字 loading
  useEffect(() => {
    if (!isLoadingAnswer) return
    session.messages.concat([LOADING_MESSAGE])
  }, [isLoadingAnswer, session.messages])

  return (
    <div className="group relative flex max-w-[90%] flex-col gap-2 overflow-hidden md:max-w-[75%]">
      <div className="rounded-lg">
        <div
          className={
            `p-3 md:p-4 lg:p-5 rounded-xl text-gray-700 relative ` +
            (isUser
              ? "bg-blue-200 justify-self-end rounded-br-none"
              : "bg-white rounded-bl-none")
          }
        >
          {/* 消息内容 */}
          {(message.preview || message.content.length === 0) && !isUser ? (
            <LoadingIcon />
          ) : (
            <div
              className="markdown-body "
              style={{ fontSize: `${config.chat_font_size}px` }}
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
