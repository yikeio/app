// 消息操作事件
import {
  BOT_HELLO,
  Message,
  useChatStore,
  useSettingsStore,
} from "@/store"

export const useMessageActions = ({ setIsLoading, inputRef }) => {
  const [session, onUserInput] = useChatStore((state) => [state.currentSession(), state.onUserInput])

  const onRightClick = (e: any, message: Message, index: number) => {
    e.preventDefault()
    // 多选逻辑
  }

  const onResend = (message: Message) => {
    setIsLoading(true)
    onUserInput(message.content).then(() => setIsLoading(false))
    inputRef.current?.focus()
  }

  const onCopy = (message: Message) => {

  }

  return {
    onCopy,
    onRightClick,
    onResend,
  };
}
