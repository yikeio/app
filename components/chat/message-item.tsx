import { useState } from "react"
import dynamic from "next/dynamic"
import { Message, toggleLikeMessage } from "@/api/conversations"
import LoadingIcon from "@/icons/loading.svg"
import { copyToClipboard } from "@/utils"
import { CopyIcon, HeartIcon, HeartOffIcon, LanguagesIcon, Volume2Icon } from "lucide-react"

import { cn, speak } from "@/lib/utils"

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon width={24} height={24} />,
})

export default function MessageBody({ message, className = "" }: { message: Partial<Message>; className?: string }) {
  const isUser = message.role === "user"
  const [hasLiked, setHasLiked] = useState(message.has_liked)

  const tanslate = (content: string) => {}
  const toggleLike = async (message: Message) => {
    await toggleLikeMessage(message.id)
    setHasLiked(!hasLiked)
  }

  return (
    <div
      className={cn("group relative flex min-w-[200px] max-w-[90%] overflow-hidden md:max-w-[75%]", className, {
        "justify-end": isUser,
      })}
    >
      <div
        className={cn(`relative flex flex-col gap-4 rounded-xl border p-3 text-gray-800 md:p-4 lg:rounded-[24px]`, {
          "rounded-br-none lg:rounded-br-none border-primary bg-primary text-primary-100/90": isUser,
          "rounded-bl-none lg:rounded-bl-none bg-primary-50": !isUser,
        })}
      >
        {(message.isLoading || message.isStreaming) && (
          <LoadingIcon className="absolute -mt-6 rounded border bg-white px-1 py-0.5" />
        )}
        {
          <div className="markdown-body break-words before:hidden after:hidden">
            <Markdown content={message.content} />
          </div>
        }

        {!message.isStreaming && (
          <div
            className={cn("flex items-center gap-4 text-xs text-gray-400", {
              "text-primary-400": isUser,
            })}
          >
            <a
              title="阅读"
              className={cn("flex cursor-pointer items-center gap-1 hover:text-primary-500", {
                "hover:text-primary-300": isUser,
              })}
              onClick={() => speak(message.content)}
            >
              <Volume2Icon size={20} />
            </a>

            <a
              title="翻译"
              className={cn("flex cursor-pointer items-center gap-1 hover:text-primary-500", {
                "hover:text-primary-300": isUser,
              })}
              onClick={() => tanslate(message.content)}
            >
              <LanguagesIcon size={20} />
            </a>

            <a
              title={hasLiked ? "取消喜欢" : "喜欢"}
              className={cn("flex cursor-pointer items-center gap-1 hover:text-primary-500", {
                "hover:text-primary-300": isUser,
              })}
              onClick={() => toggleLike(message as Message)}
            >
              {hasLiked ? <HeartOffIcon size={20} /> : <HeartIcon size={20} />}
            </a>

            <a
              title="复制"
              className={cn("flex cursor-pointer items-center gap-1 hover:text-primary-500", {
                "hover:text-primary-300": isUser,
              })}
              onClick={() => copyToClipboard(message.content)}
            >
              <CopyIcon size={20} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
