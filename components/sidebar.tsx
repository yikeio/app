import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Settings2, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="flex h-screen w-14 shrink-0 flex-col gap-6 border-r border-r-slate-200 bg-white px-2 py-4 dark:border-b-slate-700 dark:bg-slate-900">
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
      <Link href="/user" rel="noreferrer">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
        >
          <User></User>
          <span className="sr-only">我的</span>
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
