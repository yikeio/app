import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Locale from "@/locales"
import {
  SubmitKey,
  useBillingStore,
  useChatStore,
  useSettingsStore,
} from "@/store"
import { isMobileScreen } from "@/utils"
import toast from "react-hot-toast"

import { Icons } from "@/components/icons"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export default function ChatFooter(props) {
  const [userInput, setUserInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [user, config] = useSettingsStore((state) => [state.user, state.config])

  const [session, onUserInput] = useChatStore((state) => [
    state.currentSession(),
    state.onUserInput,
  ])

  const [currentCombo, setActivateVisible, setBillingModalVisible] =
    useBillingStore((state) => [
      state.currentCombo,
      state.setActivateVisible,
      state.setBillingModalVisible,
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
    if (user.state === "unactivated") {
      toast.error("账号未激活，请先激活!")
      setActivateVisible(true)
      return
    }
    if (!currentCombo.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      setBillingModalVisible(true)
      return
    }
    if (userInput.length <= 0) return
    props.setIsLoading?.(true)
    onUserInput(userInput).then(() => props.setIsLoading?.(false))
    setUserInput("")
    if (!isMobileScreen()) inputRef.current?.focus()
  }

  useLayoutEffect(() => {
    console.log("session.messages", session.messages)
    props.chatBodyRef.current?.scrollTo(
      0,
      props.chatBodyRef.current.scrollHeight
    )
  }, [session.messages])

  // Auto focus
  useEffect(() => {
    if (props.showSideBar && isMobileScreen()) return
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="sticky bottom-0 p-6">
      <div className="relative flex flex-col items-center gap-2 md:flex-row">
        <Textarea
          ref={inputRef}
          className="flex-1 w-full bg-white"
          placeholder={Locale.Chat.Input(config.chat_submit_key)}
          onChange={(e) => setUserInput(e.currentTarget.value)}
          value={userInput}
          onKeyDown={onInputKeyDown}
          autoFocus={!props.showSideBar}
        />
        <Button
          className="flex items-center gap-2 -ml-28"
          onClick={onUserSubmit}
        >
          <Icons.telegram size={20} />
          <span>发送</span>
        </Button>
      </div>
    </div>
  )
}
