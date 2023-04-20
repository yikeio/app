import { Icons } from "@/components/icons"

import {
  copyToClipboard,
  downloadAs,
  isMobileScreen,
  parseTime,
  selectOrCopy,
} from "@/utils"

import {
  BOT_HELLO,
  Message,
  useChatStore,
  useSettingsStore,
} from "@/store"

export default function MessageActions({ message, setIsLoading, inputRef }) {
  const isUser = message.role === "user"
  const [session, onUserInput] = useChatStore((state) => [state.currentSession(), state.onUserInput])

  const onResend = (message: Message) => {
    setIsLoading(true)
    onUserInput(message.content).then(() => setIsLoading(false))
    inputRef.current?.focus()
  }

  const onCopy = (message: Message) => {

  }

  return (
    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100">
        {!isUser && !message.preview && (
          <div className="text-xs text-gray-400">
            {parseTime(message.date.toLocaleString())}
          </div>
        )}

        {!isUser && !(message.preview || message.content.length === 0) && (
          // 工具栏
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {message.streaming ? (
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => onCopy(message)}
              >
                <Icons.copy size={12} /> 复制
              </div>
            ) : (
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => onResend(message)}
              >
                <Icons.reload size={12} /> 重新生成
              </div>
            )}

            <div
              className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
              onClick={() => copyToClipboard(message.content)}
            >
              <Icons.copy size={12} /> 复制
            </div>
          </div>
        )}
      </div>
  )
}