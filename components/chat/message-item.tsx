import dynamic from "next/dynamic"
import { Message } from "@/api/conversations"
import LoadingIcon from "@/icons/loading.svg"
import { copyToClipboard } from "@/utils"
import { CopyIcon, HeartIcon, LanguagesIcon, Volume2Icon } from "lucide-react"

import { cn, speak } from "@/lib/utils"

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon width={24} height={24} />,
})

export default function MessageBody({
  message,
  previousMessage: preMessage,
  className = "",
}: {
  message: Message
  previousMessage: Message
  className?: string
}) {
  const isUser = message.role === "user"

  const tanslate = (content: string) => {}
  const toggleLike = (message: Message) => {}

  return (
    <div className={cn("export-container group relative flex flex-col gap-2 overflow-hidden", className)}>
      <div className="min-w-[200px] max-w-[90%] rounded-lg md:max-w-[75%]">
        <div
          className={cn(
            `relative flex flex-col gap-4 rounded-[24px] border p-3 text-gray-800 md:p-4`,
            isUser
              ? "justify-self-end rounded-br-none border-primary bg-primary text-primary-100/90"
              : "rounded-bl-none bg-primary-50"
          )}
        >
          {(message.isLoading || message.content.length === 0) && !isUser ? (
            <LoadingIcon />
          ) : (
            <div className="markdown-body before:hidden after:hidden">
              <Markdown content={message.content} />
            </div>
          )}

          <div
            className={cn("flex items-center gap-4 text-xs text-gray-400", className, { "text-primary-400": isUser })}
          >
            <a
              title="阅读"
              className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
              onClick={() => speak(message.content)}
            >
              <Volume2Icon size={20} />
            </a>

            <a
              title="翻译"
              className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
              onClick={() => tanslate(message.content)}
            >
              <LanguagesIcon size={20} />
            </a>

            <a
              title="喜欢"
              className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
              onClick={() => toggleLike(message)}
            >
              <HeartIcon size={20} />
            </a>

            <a
              title="复制"
              className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
              onClick={() => copyToClipboard(message.content)}
            >
              <CopyIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
