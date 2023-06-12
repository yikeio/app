import { useEffect, useRef, useState } from "react"
import useLocalStorage from "@/hooks/use-localstorage"
import { SubmitKey } from "@/hooks/use-settings"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

export default function ChatInput({
  onSubmit,
  isStreaming = false,
  submitKey = SubmitKey.Enter,
}: {
  isStreaming?: boolean
  onSubmit: (input: string) => void | Promise<any>
  submitKey?: SubmitKey
}) {
  const [submiting, setSubmiting] = useState(false)
  const [input, setInput] = useLocalStorage<string>("chat.input.value", "")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") {
      return false
    }
    if (e.key === "Enter" && e.nativeEvent.isComposing) {
      return false
    }

    return (
      (submitKey === SubmitKey.AltEnter && e.altKey) ||
      (submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (submitKey === SubmitKey.Enter && !e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey)
    )
  }

  const handleSubmit = async () => {
    if (isStreaming || input.trim().length <= 0) {
      return
    }

    try {
      setSubmiting(true)
      setInput("")
      await onSubmit(input)
    } catch (error) {
      console.error(error)
      setInput(input)
    }

    setSubmiting(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!shouldSubmit(e)) {
      return
    }
    handleSubmit()
    e.preventDefault()
  }

  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.current.style.height = "0px"
      const scrollHeight = textAreaRef.current.scrollHeight
      textAreaRef.current.style.height = scrollHeight + "px"
    }
  }, [textAreaRef, input])

  return (
    <form className={cn("relative flex items-start justify-center gap-2")} onSubmit={(e) => e.preventDefault()}>
      <Textarea
        ref={textAreaRef}
        className="h-10 max-h-64 min-h-[40px] w-full flex-1 resize-none rounded-[24px] bg-primary-50 px-6 dark:bg-muted"
        placeholder={`输入消息，${submitKey} 发送`}
        onChange={(e) => setInput(e.currentTarget.value)}
        value={input}
        autoFocus={true}
        rows={1}
        disabled={isStreaming || submiting}
        onKeyDown={handleInputKeyDown}
      />

      <Button
        className="flex h-10 w-10 items-center justify-center gap-2 rounded-full p-0 text-primary-100"
        onClick={handleSubmit}
        disabled={input.length <= 0 || isStreaming || submiting}
      >
        <ArrowRightIcon size={18} />
      </Button>
    </form>
  )
}
