import { useEffect } from "react"
import dynamic from "next/dynamic"
import LoadingIcon from "@/icons/loading.svg"
import { useChatStore, useUserStore } from "@/store"
import classNames from "classnames"
import { twMerge } from "tailwind-merge"

import MessageActions from "./message-actions"

const LOADING_MESSAGE = {
  id: -3,
  role: "assistant",
  content: "……",
  date: new Date().toLocaleString(),
  preview: true,
}

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon width={24} height={24} />,
})

export default function MessageBody({
  message,
  preMessage,
  inputRef = null,
  className = "",
}) {
  const isUser = message.role === "user"

  const [session, isLoadingAnswer] = useChatStore((state) => [
    state.currentSession(),
    state.isLoadingAnswer,
  ])
  const [user] = useUserStore((state) => [state.user])

  // 请求消息时打字 loading
  useEffect(() => {
    if (!isLoadingAnswer) return
    session.messages.concat([LOADING_MESSAGE])
  }, [isLoadingAnswer, session.messages])

  return (
    <div
      className={twMerge(
        "export-container group relative flex max-w-[90%] flex-col gap-2 overflow-hidden md:max-w-[75%] min-w-[200px]",
        className
      )}
    >
      <div className="rounded-lg">
        <div
          className={twMerge(
            `p-3 md:p-4 rounded-[24px] border text-gray-800 relative flex flex-col gap-4`,
            isUser
              ? "bg-primary text-white border-primary justify-self-end rounded-br-none"
              : "bg-primary-50 rounded-bl-none"
          )}
        >
          {/* 消息内容 */}
          {(message.preview || message.content.length === 0) && !isUser ? (
            <LoadingIcon />
          ) : (
            <div className="markdown-body before:hidden after:hidden">
              <Markdown content={message.content} />
            </div>
          )}

          {user.id && inputRef && (
            <MessageActions
              message={message}
              preMessage={preMessage}
              inputRef={inputRef}
            />
          )}
        </div>
      </div>
    </div>
  )
}
