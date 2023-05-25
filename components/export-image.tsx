"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import { useActionsStore, useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"
import classNames from "classnames"
import { toPng } from "html-to-image"
import QRCode from "react-qr-code"

import { UserAvatar } from "@/components/avatar"
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
  const [user] = useUserStore((state) => [state.user])
  const canvasRef = useRef<HTMLImageElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [setMode, selectedMessages, exportImageVisible, setExportImageVisible] =
    useActionsStore((state) => [
      state.setMode,
      state.selectedMessages,
      state.exportImageVisible,
      state.setExportImageVisible,
    ])

  const referralUrl = user.referral_url || ""

  const drawImage = async (element) => {
    const dataUrl = await toPng(element)

    const { current } = canvasRef
    current.src = dataUrl
  }

  useEffect(() => {
    if (exportImageVisible) {
      setLoading(true)

      drawImage(chatRef.current).finally(() => {
        setLoading(false)
      })
    }
  }, [exportImageVisible])

  return (
    <>
      <Modal
        show={exportImageVisible}
        key={modelId}
        closeOnClickMask
        classNames="mt-2 p-0 bg-white/0 shadow-transparent"
        onClose={() => setExportImageVisible(false)}
      >
        <div className="flex min-h-[200px] flex-col items-center justify-center">
          {loading && <LoadingIcon fill="#000" className="h-[50px]" />}

          <Image
            ref={canvasRef}
            src=""
            alt=""
            className="max-h-[80vh] max-w-full"
          ></Image>

          <p className="rounded-full bg-slate-300/40 px-4 text-center text-gray-100">
            {isMobileScreen()
              ? "长按图片分享或保存到本地"
              : "右键复制图片或保存到本地"}
          </p>
        </div>
      </Modal>
      <div
        ref={chatRef}
        key={messagesId}
        className="fixed left-0 top-0 -z-10 max-w-xl overflow-auto bg-slate-100"
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
                        `px-4 py-1 rounded-xl border  text-gray-700 relative ` +
                        (message.role === "user"
                          ? "bg-blue-200 border-blue-300 justify-self-end rounded-br-none"
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

        <div className="flex min-w-[375px] items-center gap-4 bg-white p-4 shadow">
          {/* 二维码可以加上用户的邀请码，那这里就需要改为实时生成 */}
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
              <span className="underline">https://yike.io</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
