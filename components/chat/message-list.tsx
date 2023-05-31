import { useEffect, useRef, useState } from "react"
import { Message } from "@/api/conversations"
import useSettings from "@/hooks/use-settings"
import classNames from "classnames"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import MessageItem from "./message-item"

export function MessageList({
  messages,
  selectable = false,
  isStreaming = false,
  streamContent = "",
  onSelect = (messages: Message[]) => {},
}: {
  messages: Message[]
  selectable?: boolean
  isStreaming?: boolean
  streamContent?: string
  onSelect?: (messages: Message[]) => void
}) {
  const messagesContainer = useRef<HTMLDivElement>(null)
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([])

  const hasBeenSelected = (message: Message) => selectedMessages.some((m) => m.id === message.id)

  const toggleSelectMessage = (message: Message) => {
    let newSelectedMessages: Message[] = []

    if (hasBeenSelected(message)) {
      newSelectedMessages = selectedMessages.filter((m) => m.id !== message.id)
    } else {
      newSelectedMessages = [...selectedMessages, message]
    }

    setSelectedMessages(newSelectedMessages)
    onSelect(newSelectedMessages)
  }

  useEffect(() => {
    if (messages.length > 0) {
      messagesContainer.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    setSelectedMessages([])
  }, [selectable])

  return (
    <>
      <div className="flex flex-col">
        {/* 对话列表 */}
        <div className={"flex flex-1 flex-col py-6"} ref={messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("group relative z-10 flex flex-col gap-2 p-4 md:flex-row md:gap-4 md:px-6 xl:px-12", {
                "bg-primary-200/60": hasBeenSelected(message),
                "pl-10": selectable,
                "items-end md:items-start md:justify-end": message.role === "user",
                "items-start md:flex-row-reverse md:justify-end": message.role !== "user",
              })}
            >
              {selectable && (
                <div className={cn(`absolute inset-0 z-50 p-4`)} onClick={() => toggleSelectMessage(message)}>
                  <Checkbox
                    onCheckedChange={(v: boolean) => toggleSelectMessage(message)}
                    checked={hasBeenSelected(message)}
                    className="absolute left-4 top-4 rounded-full"
                  />
                </div>
              )}
              <MessageItem message={message} />
            </div>
          ))}

          {isStreaming && <MessageItem className="py-4" message={{ isStreaming, content: streamContent }} />}
        </div>
      </div>
    </>
  )
}
