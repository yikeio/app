import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { isMobileScreen } from "@/utils"
import { IconArrowAutofitContent } from "@tabler/icons-react"
import classNames from "classnames"
import { MessageSquare, Settings2, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Sidebar(props) {
  const [closed, setClosed] = useState(isMobileScreen())

  return (
    <div className="relative ">
      <Button
        className="absolute inset-y-1/3 -right-10 h-10 w-10 p-2 md:hidden"
        onClick={() => setClosed(!closed)}
      >
        <IconArrowAutofitContent />
      </Button>
      <aside
        className={classNames(
          "flex flex-col items-center flex-shrink-0 h-screen gap-6 px-2 py-4 bg-white border-r border-r-slate-200 dark:border-b-slate-700 dark:bg-slate-900",
          props.className,
          {
            hidden: closed,
          }
        )}
      >
        <Link href="/" rel="noreferrer">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-700 dark:text-slate-400"
          >
            <Image src="/logo.svg" height={24} width={24} alt="logo" />
            <span className="sr-only">首页</span>
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
    </div>
  )
}
