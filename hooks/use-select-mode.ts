import { useEffect } from "react"
import { useActionsStore, useChatStore } from "@/store"

export const useSelectMode = () => {
  const [session] = useChatStore((state) => [state.currentSession()])

  const [mode, selectedMessages, setSelectedMessages] = useActionsStore(
    (state) => [state.mode, state.selectedMessages, state.setSelectedMessages]
  )

  const handleSelect = (checked: boolean, message) => {
    const nextMessages = checked
      ? [...selectedMessages, message]
      : selectedMessages.filter((m) => m.id !== message.id)
    setSelectedMessages(nextMessages)
  }

  useEffect(() => {
    setSelectedMessages([])
  }, [session])

  return { mode, selectedMessages, handleSelect }
}
