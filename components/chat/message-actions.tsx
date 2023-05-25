import { Message, useChatStore } from "@/store"
import { copyToClipboard } from "@/utils"
import { CopyIcon, RotateCcwIcon } from "lucide-react"

import { formatTimeAgo } from "@/lib/utils"

export default function MessageActions({ message, inputRef, preMessage }) {
  const isUser = message.role === "user"
  const [onUserInput, setIsLoadingAnswer] = useChatStore((state) => [
    state.onUserInput,
    state.setIsLoadingAnswer,
    state.getConversationHistory,
  ])

  const onResend = (message: Message) => {
    setIsLoadingAnswer(true)
    onUserInput(message.content).then(() => setIsLoadingAnswer(false))
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-4">
      {!isUser && !message.preview && (
        <div className="text-xs text-gray-400">
          {formatTimeAgo(message.date || new Date())}
        </div>
      )}

      {!isUser && !(message.preview || message.content.length === 0) && (
        // 工具栏
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {!message.streaming && preMessage && (
            <div
              className="flex cursor-pointer items-center gap-1 hover:text-blue-500"
              onClick={() => onResend(preMessage)}
            >
              <RotateCcwIcon size={12} /> 重新生成
            </div>
          )}

          <div
            className="flex cursor-pointer items-center gap-1 hover:text-blue-500"
            onClick={() => copyToClipboard(message.content)}
          >
            <CopyIcon size={12} /> 复制
          </div>
        </div>
      )}
    </div>
  )
}
