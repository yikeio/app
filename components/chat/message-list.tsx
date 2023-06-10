import { useEffect, useRef, useState } from "react"
import { Message } from "@/api/conversations"

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
  const bottom = useRef<HTMLDivElement>(null)
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([])
  const scrollIntoViewTimeId = useRef<NodeJS.Timer | null>(null)

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

  const scrollLastMessageIntoView = () => {
    bottom.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollLastMessageIntoView()
      }, 300)
    }
  }, [messages])

  useEffect(() => {
    setSelectedMessages([])
  }, [selectable])

  useEffect(() => {
    if (!isStreaming) {
      if (scrollIntoViewTimeId) {
        clearInterval(scrollIntoViewTimeId.current)
      }
      return
    }

    scrollIntoViewTimeId.current = setInterval(() => {
      scrollLastMessageIntoView()
    }, 1000)
  }, [isStreaming])

  const messageItemWrapperClassNames =
    "group relative z-10 flex flex-col gap-2 p-4 md:flex-row md:gap-4 md:px-6 xl:px-12"

  return (
    <>
      <div className="flex flex-col overflow-y-auto" id="test">
        {/* 对话列表 */}
        <div className={"flex flex-1 flex-col py-6"}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(messageItemWrapperClassNames, {
                "bg-primary-200/60 dark:bg-muted": hasBeenSelected(message),
                "pl-10": selectable,
                "md:justify-end": message.role === "user",
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
              <MessageItem
                message={message}
                className={cn({
                  "self-end": message.role === "user",
                })}
              />
            </div>
          ))}

          {isStreaming && (
            <MessageItem className={messageItemWrapperClassNames} message={{ isStreaming, content: streamContent }} />
          )}
        </div>
        <div ref={bottom}></div>
      </div>
    </>
  )
}
