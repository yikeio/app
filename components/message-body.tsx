import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useChatStore, useUserStore } from "@/store"
import classNames from "classnames"

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

export default function MessageBody({
  message,
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
      className={classNames(
        "export-container group relative flex max-w-[90%] flex-col gap-2 overflow-hidden md:max-w-[75%]",
        className
      )}
    >
      <div className="rounded-lg">
        <div
          className={
            `p-3 md:p-4 rounded-xl border text-gray-700 relative ` +
            (isUser
              ? "bg-blue-200 border-blue-300 justify-self-end rounded-br-none"
              : "bg-white rounded-bl-none")
          }
        >
          {/* 消息内容 */}
          {(message.preview || message.content.length === 0) && !isUser ? (
            <LoadingIcon />
          ) : (
            <div className="markdown-body before:hidden after:hidden">
              <Markdown content={message.content} />
            </div>
          )}
        </div>
      </div>
      {user.id && inputRef && (
        <MessageActions message={message} inputRef={inputRef} />
      )}
    </div>
  )
}
