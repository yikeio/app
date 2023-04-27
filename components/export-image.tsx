import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { useActionsStore, useChatStore, useSettingsStore } from "@/store"
import classNames from "classnames"
import html2canvas from "html2canvas"

import { UserAvatar } from "@/components/avatar"
import { Button } from "@/components/ui/button"
import LoadingIcon from "../icons/loading.svg"
import { Markdown } from "./markdown"
import Modal from "./modal"

/**
 * 1. 设置一个 z-index: -999 的 dom，用于渲染聊天记录和转 canvas
 * 2. 设置一个 canvas，转完之后渲染 1 转出的 canvas
 */
export default function ExportImage() {
  const modelId = useId()
  const messagesId = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [setMode, selectedMessages, exportImageVisible, setExportImageVisible] =
    useActionsStore((state) => [
      state.setMode,
      state.selectedMessages,
      state.exportImageVisible,
      state.setExportImageVisible,
    ])

  const drawImage = async (element) => {
    const canvas = await html2canvas(element, {
      useCORS: true,
    })

    const { current } = canvasRef
    current.width = canvas.width
    current.height = canvas.height
    const ctx = current.getContext("2d")
    ctx.drawImage(canvas, 0, 0)
  }

  useLayoutEffect(() => {
    if (exportImageVisible) {
      setLoading(true)

      drawImage(chatRef.current).finally(() => {
        setLoading(false)
      })
    }
  }, [exportImageVisible])

  return [
    <Modal
      show={exportImageVisible}
      key={modelId}
      closeOnClickMask
      classNames="mt-2 p-0 bg-white/0 shadow-transparent"
      onClose={() => setExportImageVisible(false)}
    >
      <div className="flex min-h-[200px] flex-col items-center justify-center">
        {loading && <LoadingIcon fill="#000" />}
        <canvas
          ref={canvasRef}
          height="0"
          className="max-h-[80vh] max-w-full"
        ></canvas>
        <p className="rounded-full bg-slate-300/40 px-4 text-center text-gray-100">
          右键复制图片或保存到本地
        </p>
      </div>
    </Modal>,
    <div
      ref={chatRef}
      key={messagesId}
      className="fixed -z-10 max-w-xl overflow-auto bg-slate-100"
    >
      <div className="flex flex-col gap-6 px-4 py-6">
        {[...selectedMessages]
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((message) => (
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
              <div className="group relative flex max-w-[90%] flex-col gap-2 overflow-hidden md:max-w-[75%]">
                <div className="rounded-lg">
                  <div
                    className={
                      `px-4 py-1 rounded-xl text-gray-700 relative ` +
                      (message.role === "user"
                        ? "bg-blue-200 justify-self-end rounded-br-none"
                        : "bg-white rounded-bl-none")
                    }
                  >
                    {/* 消息内容 */}
                    {
                      <div
                        className="markdown-body before:hidden"
                        style={{ fontSize: `${12}px` }}
                      >
                        <Markdown content={message.content} />
                      </div>
                    }
                  </div>
                </div>
              </div>
              <UserAvatar role={message.role} className="shadow-none" />
            </div>
          ))}
      </div>

      <div className="flex items-start gap-4 border-t bg-white p-4">
        {/* 二维码可以加上用户的邀请码，那这里就需要改为实时生成 */}
        <Image
          src="/qrcode.png"
          width={48}
          height={48}
          alt=""
          className="mt-[6px] h-12 w-12 bg-slate-100"
        />
        <div className="flex flex-col gap-2">
          <h4 className="m-0 font-bold leading-none">一刻 AI 助手</h4>
          <div className="m-0 text-sm text-gray-400">
            <span>扫码即可体验智能问答</span>
            <span className="underline">https://yike.io</span>
          </div>
        </div>
      </div>
    </div>,
  ]
}
