"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import { Message } from "@/api/conversations"
import { User } from "@/api/users"
import * as Portal from "@radix-ui/react-portal"
import { toJpeg } from "html-to-image"
import { ImageIcon, XIcon } from "lucide-react"
import QRCode from "react-qr-code"

import { cn, isMobileScreen } from "@/lib/utils"
import Loading from "../loading"
import { Markdown } from "../markdown"
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog"
import { Button } from "../ui/button"

export default function MessageExporter({
  messages,
  user,
  onCancel,
}: {
  messages: Message[]
  user: User
  onCancel: () => void
}) {
  const messagesId = useId()
  const canvasRef = useRef<HTMLImageElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const referralUrl = user.referral_url

  const drawImage = async (element) => {
    const dataUrl = await toJpeg(element, { style: { opacity: "1" } })
    canvasRef.current.src = dataUrl
  }

  const handleDrawImage = () => {
    setLoading(true)
    setOpen(true)

    drawImage(chatRef.current).finally(() => {
      setLoading(false)
    })
  }

  const handleFinish = () => {
    setOpen(false)
    document.body.classList.remove("overflow-hidden")
    onCancel()
  }

  useEffect(() => {
    document.body.classList.add("overflow-hidden")
  }, [])

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="text-muted-foreground">已选择 {messages.length} 条消息</div>
        <div className="flex items-center gap-4">
          <Button className="flex w-full items-center gap-2 md:w-auto" onClick={handleDrawImage}>
            <ImageIcon size={16} />
            <span>导出</span>
          </Button>
          <Button variant="secondary" className="flex w-full items-center gap-2 md:w-auto" onClick={onCancel}>
            <XIcon size={16} />
            <span>取消</span>
          </Button>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={(v) => setOpen(v)}>
        <AlertDialogContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-6">
            {loading && <Loading />}

            <Image ref={canvasRef} src="" alt="" className="max-h-[80vh] max-w-full"></Image>

            <div className="rounded-full bg-primary-300/40 px-4 py-1 text-center text-xs text-foreground dark:bg-muted">
              {isMobileScreen() ? "长按图片分享或保存到本地" : "右键复制图片或保存到本地"}
            </div>
            <Button className="w-full max-w-sm" variant="secondary" onClick={handleFinish}>
              完成
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Portal.Root ref={chatRef} key={messagesId} className="max-w-xl bg-white dark:bg-background">
        <div className="flex flex-col gap-6 px-4 py-6">
          {messages
            .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
            .map((message) => (
              <div
                key={message.id}
                className={cn("relative flex flex-col-reverse items-start gap-2 md:flex-row md:gap-4", {
                  "items-end md:items-start md:justify-end": message.role === "user",
                  "items-start md:flex-row-reverse md:justify-end": message.role !== "user",
                })}
              >
                <div className="group relative flex max-w-[90%] flex-col gap-2 overflow-hidden md:max-w-[75%]">
                  <div className="rounded-lg">
                    <div
                      className={
                        `p-4 rounded-xl border  text-foreground relative ` +
                        (message.role === "user"
                          ? "rounded-br-none lg:rounded-br-none border-primary bg-primary text-primary-100/90"
                          : "rounded-bl-none lg:rounded-bl-none bg-primary-50 dark:bg-muted")
                      }
                    >
                      <div className="markdown-body before:hidden">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex min-w-[375px] items-center gap-4 bg-white p-4 shadow dark:bg-muted">
          <div className="flex h-14 w-14 items-center justify-center border border-black p-0.5 dark:border-white">
            <QRCode
              value={referralUrl}
              size={68}
              style={{ height: 46, maxWidth: 46, width: 46, margin: 0, background: "transparent" }}
              viewBox={`0 0 68 68`}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="m-0 p-0 text-xl font-bold leading-none text-foreground">一刻 AI 助手</h4>
            <div className="m-0 text-sm text-muted-foreground">
              <span className="mr-2">扫码即可体验智能问答</span>
              <span className="underline">https://{window.location.host}</span>
            </div>
          </div>
        </div>
      </Portal.Root>
    </>
  )
}
