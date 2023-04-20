import { useRef } from "react"
import { useLazyLoadMessage } from "@/hooks/use-lazy-load-message"
import { usePrompt } from "@/hooks/use-prompt"
import { useChatStore } from "@/store"
import classNames from "classnames"

import { UserAvatar } from "@/components/avatar"
import ChatFooter from "./chat-footer"
import ChatHeader from "./chat-header"
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
  // TODO
  const { xxx } = usePrompt()

  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-y-auto bg-slate-100">
      <ChatHeader toggleSidebar={props.toggleSidebar} />

      {/* 对话列表 */}
      <div
        className="flex flex-col flex-1 gap-2 p-6 overflow-y-auto"
        ref={chatBodyRef}
        onScroll={onChatBodyScroll}
        onTouchStart={() => inputRef.current?.blur()}
      >
        {isLoadingMessage && <div className="block animate-spin" />}
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={classNames(
              "flex flex-col-reverse md:flex-row items-start gap-2 md:gap-4",
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
          </div>
        ))}
      </div>

      <ChatFooter
        inputRef={inputRef}
        showSideBar={props.showSideBar}
        autoScrollBottomRef={autoScrollBottomRef}
      />
    </div>
  )
}
