import { useState } from "react"
import { Message } from "@/api/conversations"
import useSettings from "@/hooks/use-settings"
import classNames from "classnames"

import { Checkbox } from "@/components/ui/checkbox"
import MessageItem from "./message-item"

export function MessageList({
  messages,
  selectable = false,
  onSelected = (messages: Message[]) => undefined,
}: {
  messages: Message[]
  selectable?: boolean
  onSelected?: (messages: Message[]) => void
}) {
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
    onSelected(newSelectedMessages)
  }

  return (
    <>
      <div className="flex flex-col overflow-y-auto p-4 md:p-6 xl:p-12">
        {/* 对话列表 */}
        <div className={"flex flex-1 flex-col py-6"}>
          {/* {isLoadingMessage && <div className="block animate-spin" />} */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={classNames("flex flex-col-reverse md:flex-row gap-2 md:gap-4 relative z-10", {
                "items-end md:items-start md:justify-end": message.role === "user",
                "items-start md:flex-row-reverse md:justify-end": message.role !== "user",
                "bg-primary-200/60": hasBeenSelected(message),
                "pl-10": selectable,
              })}
            >
              <MessageItem className="py-4" message={message} previousMessage={messages[index - 1]} />

              {selectable && (
                <div className={classNames(`absolute inset-0 p-4 z-50`)} onClick={() => toggleSelectMessage(message)}>
                  <Checkbox
                    onCheckedChange={(v: boolean) => toggleSelectMessage(message)}
                    checked={hasBeenSelected(message)}
                    className={classNames("rounded-full", {
                      "right-0": message.role === "user",
                      "left-0": message.role !== "user",
                    })}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
