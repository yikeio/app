import { useRef } from "react"
import { useLazyLoadMessage } from "@/hooks/use-lazy-load-message"
import { usePrompt } from "@/hooks/use-prompt"
import { useSelectMode } from "@/hooks/use-select-mode"
import { useChatStore } from "@/store"
import classNames from "classnames"

import { UserAvatar } from "@/components/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import ChatFooter from "./chat-footer"
import ChatHeader from "./chat-header"
import ExportImage from "./export-image"
import MessageBody from "./message-body"

export function Chat(props: {
  showSideBar: boolean
  toggleSidebar: () => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [session] = useChatStore((state) => [state.currentSession()])

  const {
    chatBodyRef,
    isLoadingMessage,
    onChatBodyScroll,
    autoScrollBottomRef,
  } = useLazyLoadMessage()

  const { mode, selectedMessages, toggleSelectMessage } = useSelectMode()

  const hasChecked = (message: any) => selectedMessages.includes(message)

  // // TODO
  // const { xxx } = usePrompt()

  return (
    <div className="flex max-h-screen flex-1 flex-col overflow-y-auto bg-slate-100">
      <ChatHeader
        toggleSidebar={props.toggleSidebar}
        autoScrollBottomRef={autoScrollBottomRef}
      />

      {/* 对话列表 */}
      <div
        className={"flex flex-1 flex-col overflow-y-auto py-6"}
        ref={chatBodyRef}
        onScroll={onChatBodyScroll}
        onTouchStart={() => inputRef.current?.blur()}
      >
        {isLoadingMessage && <div className="block animate-spin" />}
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={classNames(
              "flex flex-col-reverse md:flex-row items-start gap-2 md:gap-4 relative p-4 z-10",
              {
                "items-end md:items-start md:justify-end":
                  message.role === "user",
                "items-start md:flex-row-reverse md:justify-end":
                  message.role !== "user",
                "bg-slate-200/60": hasChecked(message),
                "pl-10": mode === "select",
              }
            )}
          >
            <MessageBody message={message} inputRef={inputRef} />
            <UserAvatar role={message.role} />
            {mode === "select" && (
              <div
                className={classNames(`absolute inset-0 p-4 z-50`)}
                onClick={() => toggleSelectMessage(message)}
              >
                <Checkbox
                  onCheckedChange={(v: boolean) => toggleSelectMessage(message)}
                  checked={hasChecked(message)}
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

      <ChatFooter
        inputRef={inputRef}
        autoScrollBottomRef={autoScrollBottomRef}
      />

      <ExportImage />
    </div>
  )
}
