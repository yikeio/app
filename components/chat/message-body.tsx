import { useEffect } from "react"
import dynamic from "next/dynamic"
import { User } from "@/api/users"
import LoadingIcon from "@/icons/loading.svg"
import { Message } from "@/store"

import { cn, formatRelativeTime } from "@/lib/utils"
import MessageActions from "./actions"

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon width={24} height={24} />,
})

export default function MessageBody({
  message,
  preMessage,
  user,
  className = "",
}: {
  message: Message
  preMessage: Message
  user: User
  className?: string
}) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "export-container group relative flex flex-col gap-2 overflow-hidden",
        className
      )}
    >
      <div className="min-w-[200px] max-w-[90%] rounded-lg md:max-w-[75%]">
        <div
          className={cn(
            `relative flex flex-col gap-4 rounded-[24px] border p-3 text-gray-800 md:p-4`,
            isUser
              ? "justify-self-end rounded-br-none border-primary bg-primary text-primary-100/90"
              : "rounded-bl-none bg-primary-50"
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

          {user?.id && (
            <MessageActions
              message={message}
              previousMessage={preMessage}
              className={cn({ "text-primary-400": isUser })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
