import Link from "next/link"
import Image from "next/image"

import { Icons } from "@/components/icons"
// import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <aside className="flex flex-col border-r border-r-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900 py-4 px-2 h-screen gap-6 flex-shrink-0">
      <Link
        href='/'
        rel="noreferrer"
      >
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
            className: "text-slate-700 dark:text-slate-400",
          })}
        >
          <Image src="/logo.svg" height={24} width={24} alt="logo" />
          <span className="sr-only">Chat</span>
        </div>
      </Link>
      <Link
        href='/setting'
        rel="noreferrer"
      >
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
            className: "text-slate-700 dark:text-slate-400",
          })}
        >
          <Icons.setting />
          <span className="sr-only">Setting</span>
        </div>
      </Link>
      {/* 待页面支持暗黑模式后开启 */}
      {/* <ThemeToggle /> */}
    </aside>
  )
}
