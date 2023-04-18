import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="flex flex-col flex-shrink-0 h-screen gap-6 px-2 py-4 bg-white border-r border-r-slate-200 dark:border-b-slate-700 dark:bg-slate-900">
      <Link href="/" rel="noreferrer">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
        >
          <Image src="/logo.svg" height={24} width={24} alt="logo" />
          <span className="sr-only">Chat</span>
        </Button>
      </Link>
      <Link href="/chat" rel="noreferrer">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
        >
          <MessageSquare></MessageSquare>
          <span className="sr-only">会话</span>
        </Button>
      </Link>
      <Link href="/settings" rel="noreferrer">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
        >
          <Settings2></Settings2>
          <span className="sr-only">设置</span>
        </Button>
      </Link>
      {/* 待页面支持暗黑模式后开启 */}
      {/* <ThemeToggle /> */}
    </aside>
  )
}
