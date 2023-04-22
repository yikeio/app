import { useEffect, useState } from "react"
import Locale from "@/locales"
import {
  SubmitKey,
  useActionsStore,
  useBillingStore,
  useChatStore,
  useSettingsStore,
  useUserStore,
} from "@/store"
import { isMobileScreen } from "@/utils"
import { ControllerPool } from "@/utils/requests"
import classNames from "classnames"
import toast from "react-hot-toast"

import { Icons } from "@/components/icons"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export default function ChatFooter(props) {
  const { autoScrollBottomRef, inputRef } = props
  const [userInput, setUserInput] = useState("")

  const [config] = useSettingsStore((state) => [state.config])
  const [user] = useUserStore((state) => [state.user])

  const [session, onUserInput, setIsLoadingAnswer] = useChatStore((state) => [
    state.currentSession(),
    state.onUserInput,
    state.setIsLoadingAnswer,
  ])

  const [currentCombo, setBillingModalVisible] = useBillingStore((state) => [
    state.currentCombo,
    state.setBillingModalVisible,
  ])

  const [mode, setMode, selectedMessages, setExportImageVisible] =
    useActionsStore((state) => [
      state.mode,
      state.setMode,
      state.selectedMessages,
      state.setExportImageVisible,
    ])

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return false
    if (e.key === "Enter" && e.nativeEvent.isComposing) return false
    return (
      (config.chat_submit_key === SubmitKey.AltEnter && e.altKey) ||
      (config.chat_submit_key === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.chat_submit_key === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.chat_submit_key === SubmitKey.MetaEnter && e.metaKey) ||
      (config.chat_submit_key === SubmitKey.Enter &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey)
    )
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!shouldSubmit(e)) return
    onUserSubmit()
    e.preventDefault()
  }

  // submit user input
  const onUserSubmit = () => {
    // 输入中不允许发送
    if (ControllerPool.isStreaming) return
    if (userInput.length <= 0) return

    if (!currentCombo.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      setBillingModalVisible(true)
      return
    }
    setIsLoadingAnswer(true)
    onUserInput(userInput).then(() => setIsLoadingAnswer(false))
    autoScrollBottomRef.current = true
    setUserInput("")
    if (!isMobileScreen()) inputRef.current?.focus()
  }

  // Auto focus
  useEffect(() => {
    inputRef.current.focus?.()
  }, [])

  return (
    <div className="sticky bottom-0 px-10 pb-10 pt-4">
      <div
        className={classNames(
          "relative flex flex-col items-start gap-2 md:flex-row",
          {
            hidden: mode !== "normal",
          }
        )}
      >
        <Textarea
          ref={inputRef}
          className="h-auto w-full flex-1 bg-white"
          placeholder={Locale.Chat.Input(config.chat_submit_key)}
          onChange={(e) => setUserInput(e.currentTarget.value)}
          onFocus={() => (autoScrollBottomRef.current = true)}
          onBlur={() => (autoScrollBottomRef.current = true)}
          value={userInput}
          rows={1}
          onKeyDown={onInputKeyDown}
          autoFocus={!props.showSideBar}
        />
        <Button
          className="flex w-full items-center gap-2 md:w-auto"
          onClick={onUserSubmit}
        >
          <Icons.telegram size={12} />
          <span>发送</span>
        </Button>
      </div>
      <div
        className={classNames("flex gap-4 justify-center", {
          hidden: mode !== "select",
        })}
      >
        <Button
          disabled={!selectedMessages.length}
          onClick={() => setExportImageVisible(true)}
        >
          导出图片
        </Button>
        <Button variant="destructive" onClick={() => setMode("normal")}>
          取消
        </Button>
      </div>
    </div>
  )
}
