import { useEffect, useRef } from "react"
import { useActionsStore } from "@/store"

import { Button } from "@/components/ui/button"
import Modal from "./modal"

export default function ExportImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [setMode, selectedMessages, exportImageVisible, setExportImageVisible] =
    useActionsStore((state) => [
      state.setMode,
      state.selectedMessages,
      state.exportImageVisible,
      state.setExportImageVisible,
    ])

  // TODO: 生成聊天图片
  useEffect(() => {
    console.log("render", canvasRef.current, exportImageVisible)
    // if (exportImageVisible) {
    //   const canvas = canvasRef.current;
    //   const ctx = canvas.getContext('2d');
    // }
  }, [exportImageVisible])

  return (
    <Modal
      show={exportImageVisible}
      closeOnClickMask
      onClose={() => setExportImageVisible(false)}
    >
      <div className="flex flex-col items-center gap-6">
        <canvas ref={canvasRef} />

        <Button>下载图片</Button>
      </div>
    </Modal>
  )
}
