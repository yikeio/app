import { useRef } from "react"
import { useLazyLoadMessage } from "@/hooks/use-lazy-load-message"
import { useSelectMode } from "@/hooks/use-select-mode"
import { usePrompt } from "@/hooks/use-prompt"
import { useChatStore } from "@/store"
import classNames from "classnames"

import { UserAvatar } from "@/components/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import ChatFooter from "./chat-footer"
import ChatHeader from "./chat-header"
import MessageBody from "./message-body"
import ExportImage from "./export-image"

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

  const { mode, selectedMessages, handleSelect } = useSelectMode()

  // TODO
  const { xxx } = usePrompt()


  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-y-auto bg-slate-100">
      <ChatHeader
        toggleSidebar={props.toggleSidebar}
        autoScrollBottomRef={autoScrollBottomRef}
      />

      {/* 对话列表 */}
      <div
        className={"flex flex-col flex-1 gap-2 py-6 px-10 overflow-y-auto"}
        ref={chatBodyRef}
        onScroll={onChatBodyScroll}
        onTouchStart={() => inputRef.current?.blur()}
      >
        {isLoadingMessage && <div className="block animate-spin" />}
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={classNames(
              "flex flex-col-reverse md:flex-row items-start gap-2 md:gap-4 relative",
              {
                "items-end md:items-start md:justify-end":
                  message.role === "user",
                "items-start md:flex-row-reverse md:justify-end":
                  message.role !== "user",
              }
            )}
          >
            <MessageBody message={message} inputRef={inputRef} />
            <UserAvatar role={message.role} />
            {mode === "select" && (
              <Checkbox
                onCheckedChange={(v: boolean) => handleSelect(v, message)}
                checked={selectedMessages.some((m) => m.id === message.id)}
                className={classNames("absolute", {
                  "top-3 -right-6": message.role === "user",
                  "top-3 -left-6": message.role !== "user",
                })}
              />
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
