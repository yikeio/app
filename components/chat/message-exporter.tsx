"use client"

import { useId, useRef, useState } from "react"
import Image from "next/image"
import { Message } from "@/api/conversations"
import { User } from "@/api/users"
import { isMobileScreen } from "@/utils"
import * as Portal from "@radix-ui/react-portal"
import { toJpeg } from "html-to-image"
import { ImageIcon, XIcon } from "lucide-react"
import QRCode from "react-qr-code"

import { cn } from "@/lib/utils"
import Loading from "../loading"
import { Button } from "../ui/button"
import { Dialog, DialogContent } from "../ui/dialog"
import { Markdown } from "./markdown"

/**
 * 1. 设置一个 z-index: -999 的 dom，用于渲染聊天记录和转 canvas
 * 2. 设置一个 canvas，转完之后渲染 1 转出的 canvas
 */
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
  const [show, setShow] = useState<boolean>(false)

  const referralUrl = user.referral_url

  const drawImage = async (element) => {
    const dataUrl = await toJpeg(element, { style: { opacity: "1" } })
    canvasRef.current.src = dataUrl
  }

  const handleDrawImage = () => {
    setLoading(true)
    setShow(true)

    drawImage(chatRef.current).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="text-gray-500">已选择 {messages.length} 条消息</div>
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

      <Dialog open={show} onOpenChange={(v) => setShow(v)}>
        <DialogContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            {loading && <Loading />}

            <Image ref={canvasRef} src="" alt="" className="max-h-[80vh] max-w-full"></Image>

            <p className="rounded-full bg-primary-300/40 px-4 py-1 text-center text-xs text-gray-700">
              {isMobileScreen() ? "长按图片分享或保存到本地" : "右键复制图片或保存到本地"}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Portal.Root ref={chatRef} key={messagesId} className="max-w-xl bg-white opacity-0">
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
                        `p-4 rounded-xl border  text-gray-700 relative ` +
                        (message.role === "user"
                          ? "rounded-br-none lg:rounded-br-none border-primary bg-primary text-primary-100/90"
                          : "rounded-bl-none lg:rounded-bl-none bg-primary-50")
                      }
                    >
                      <div className="markdown-body before:hidden">
                        <Markdown content={message.content} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex min-w-[375px] items-center gap-4 bg-white p-4 shadow">
          <QRCode
            value={referralUrl}
            className="h-12 w-12 bg-slate-100"
            size={72}
            style={{ height: 48, maxWidth: 48, width: 48, margin: 0 }}
            viewBox={`0 0 72 72`}
          />
          <div className="flex flex-col gap-2">
            <h4 className="m-0 p-0 font-bold leading-none">一刻 AI 助手</h4>
            <div className="m-0 text-sm text-gray-400">
              <span className="mr-2">扫码即可体验智能问答</span>
              <span className="underline">https://{window.location.host}</span>
            </div>
          </div>
        </div>
      </Portal.Root>
    </>
  )
}
