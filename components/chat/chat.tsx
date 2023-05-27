import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import useAuth from "@/hooks/use-auth"
import { useLazyLoadMessage } from "@/hooks/use-lazy-load-message"
import { useSelectMode } from "@/hooks/use-select-mode"
import { useBillingStore, useChatStore, useSettingsStore } from "@/store"
import classNames from "classnames"
import { StopCircleIcon } from "lucide-react"
import { toast } from "react-hot-toast"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "../ui/button"
import ChatInput from "./input"
import MessageBody from "./message-body"

export function Chat() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuth()
  const [session] = useChatStore((state) => [state.currentSession()])

  const { chatBodyRef, isLoadingMessage, onChatBodyScroll } =
    useLazyLoadMessage()

  const { mode, selectedMessages, toggleSelectMessage } = useSelectMode()

  const hasChecked = (message: any) => selectedMessages.includes(message)

  const router = useRouter()
  const [config] = useSettingsStore((state) => [state.config])

  const [isStreaming, onUserInput, onUserInputStop, setIsLoadingAnswer] =
    useChatStore((state) => [
      state.isStreaming,
      state.onUserInput,
      state.onUserInputStop,
      state.setIsLoadingAnswer,
    ])

  const [currentQuota, getUserQuotaInfo] = useBillingStore((state) => [
    state.currentQuota,
    state.getUserQuotaInfo,
  ])

  const handleStop = () => {
    onUserInputStop()
  }

  // submit user input
  const onUserSubmit = (input: string) => {
    if (isStreaming) {
      return
    }

    if (!currentQuota.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      return router.push("/pricing")
    }
    setIsLoadingAnswer(true)
    onUserInput(input).then(() => setIsLoadingAnswer(false))
  }

  useEffect(() => {
    user && getUserQuotaInfo(user.id)
  }, [user])

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 xl:p-12">
        {/* 对话列表 */}
        <div
          className={"flex flex-1 flex-col py-6"}
          ref={chatBodyRef}
          onScroll={onChatBodyScroll}
          onTouchStart={() => inputRef.current?.blur()}
        >
          {isLoadingMessage && <div className="block animate-spin" />}
          {session.messages.map((message, index) => (
            <div
              key={message.id}
              className={classNames(
                "flex flex-col-reverse md:flex-row gap-2 md:gap-4 relative z-10",
                {
                  "items-end md:items-start md:justify-end":
                    message.role === "user",
                  "items-start md:flex-row-reverse md:justify-end":
                    message.role !== "user",
                  "bg-primary-200/60": hasChecked(message),
                  "pl-10": mode === "select",
                }
              )}
            >
              <MessageBody
                className="py-4"
                message={message}
                user={user}
                preMessage={session.messages[index - 1]}
              />
              {mode === "select" && (
                <div
                  className={classNames(`absolute inset-0 p-4 z-50`)}
                  onClick={() => toggleSelectMessage(message)}
                >
                  <Checkbox
                    onCheckedChange={(v: boolean) =>
                      toggleSelectMessage(message)
                    }
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
      </div>
      <footer className="sticky bottom-0 z-10 p-4 md:p-6 xl:p-12">
        {isStreaming && (
          <Button
            className="flex w-full items-center gap-2 md:w-auto"
            onClick={handleStop}
          >
            <StopCircleIcon size={12} />
            <span>停止生成</span>
          </Button>
        )}
        <ChatInput submitKey={config.chat_submit_key} onSubmit={onUserSubmit} />
      </footer>
    </>
  )
}
