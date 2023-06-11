import { Laptop2Icon } from "lucide-react"

import { Button } from "../ui/button"

export default function HomeChatFeatures() {
  return (
    <div className="flex flex-col gap-20 rounded-xl">
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-3xl lg:text-5xl">沉浸式交互体验</h2>
        <div className="text-muted-foreground">全新设计的沉浸式 UI 界面，让你更专注于内容，减少不必要的干扰 </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-6 rounded-xl bg-gradient-to-r from-primary-600/50 from-10% via-primary-300/50 to-primary-700/50 p-6 lg:flex-row lg:gap-12 lg:p-12">
          <div className="overflow-hidden rounded-lg border border-primary lg:w-1/2">
            <img src="/home/features/chat-1.png" alt="Chat" />
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="flex items-center gap-3">
              <Laptop2Icon /> 干净的聊天界面
            </h3>
            <div className="text-gray-700 dark:text-gray-300">
              移除或简化不重要的信息模块，让用户专注于内容本身，以获得更好的交互体验。
            </div>
            <div>
              <Button variant="secondary">立即使用</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
