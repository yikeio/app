import { Message, useChatStore } from "@/store"
import { copyToClipboard } from "@/utils"

import { formatTimeAgo } from "@/lib/utils"
import { Icons } from "@/components/icons"

export default function MessageActions({ message, inputRef }) {
  const isUser = message.role === "user"
  const [onUserInput, setIsLoadingAnswer] = useChatStore((state) => [
    state.onUserInput,
    state.setIsLoadingAnswer,
  ])

  const onResend = (message: Message) => {
    setIsLoadingAnswer(true)
    onUserInput(message.content).then(() => setIsLoadingAnswer(false))
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100">
      {!isUser && !message.preview && (
        <div className="text-xs text-gray-400">
          {formatTimeAgo(message.date || new Date())}
        </div>
      )}

      {!isUser && !(message.preview || message.content.length === 0) && (
        // 工具栏
        <div className="flex items-center gap-4 text-xs text-gray-400">
          {!message.streaming && (
            <div
              className="flex cursor-pointer items-center gap-1 hover:text-blue-500"
              onClick={() => onResend(message)}
            >
              <Icons.reload size={12} /> 重新生成
            </div>
          )}

          <div
            className="flex cursor-pointer items-center gap-1 hover:text-blue-500"
            onClick={() => copyToClipboard(message.content)}
          >
            <Icons.copy size={12} /> 复制
          </div>
        </div>
      )}
    </div>
  )
}
