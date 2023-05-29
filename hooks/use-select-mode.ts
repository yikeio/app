import { useEffect } from "react"
import { useActionsStore, useChatStore } from "@/store"

export const useSelectMode = () => {
  const [session] = useChatStore((state) => [state.currentSession()])

  const [mode, selectedMessages, setSelectedMessages, clearSelectedMessages] = useActionsStore((state) => [
    state.mode,
    state.selectedMessages,
    state.setSelectedMessages,
    state.clearSelectedMessages,
  ])

  const toggleSelectMessage = (message) => {
    const checked = !selectedMessages.some((m) => m.id === message.id)
    const nextMessages = checked ? [...selectedMessages, message] : selectedMessages.filter((m) => m.id !== message.id)
    setSelectedMessages(nextMessages)
  }

  useEffect(() => {
    setSelectedMessages([])
  }, [session])

  return { mode, selectedMessages, clearSelectedMessages, toggleSelectMessage }
}
