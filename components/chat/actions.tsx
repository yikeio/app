import { Message, useChatStore } from "@/store"
import { copyToClipboard } from "@/utils"
import classNames from "classnames"
import {
  CopyIcon,
  HeartIcon,
  LanguagesIcon,
  RotateCcwIcon,
  SpeakerIcon,
  Volume2Icon,
} from "lucide-react"

import { cn, speak } from "@/lib/utils"

export default function MessageActions({
  message,
  previousMessage,
  className = "",
}: {
  message: Message
  className?: string
  previousMessage: Message
}) {
  const [onUserInput, setIsLoadingAnswer] = useChatStore((state) => [
    state.onUserInput,
    state.setIsLoadingAnswer,
  ])

  const handleResend = (message: Message) => {
    setIsLoadingAnswer(true)
    onUserInput(message.content).then(() => setIsLoadingAnswer(false))
  }

  return (
    <div
      className={cn("flex items-center gap-4 text-xs text-gray-400", className)}
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
        onClick={() => copyToClipboard(message.content)}
      >
        <LanguagesIcon size={20} />
      </a>

      <a
        title="喜欢"
        className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
        onClick={() => copyToClipboard(message.content)}
      >
        <HeartIcon size={20} />
      </a>

      {!message.streaming && previousMessage && (
        <a
          title="重新生成"
          className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
          onClick={() => handleResend(previousMessage)}
        >
          <RotateCcwIcon size={20} />
        </a>
      )}

      <a
        title="复制"
        className="flex cursor-pointer items-center gap-1 hover:text-primary-500"
        onClick={() => copyToClipboard(message.content)}
      >
        <CopyIcon size={20} />
      </a>
    </div>
  )
}
