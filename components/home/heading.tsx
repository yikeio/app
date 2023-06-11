import Image from "next/image"
import Link from "next/link"

import { HomeThemeToggle } from "./theme-toggle"

export default function HomeHeading() {
  return (
    <div className="flex items-center justify-between">
      <Link className="inline-flex items-center justify-start gap-2 p-4  text-slate-700 dark:text-white " href="/">
        <Image src="/logo.svg" height={24} width={24} alt="logo" />
        <div className="text-xl leading-none ">一刻</div>
      </Link>
      <div className="flex flex-1 items-center justify-end gap-6">
        <Link href="#pricing">价格</Link>
        <Link href="#download">下载</Link>
        <Link href="/prompts" className="rounded-full border border-muted-foreground px-4 py-1 text-sm">
          立即使用
        </Link>
        <HomeThemeToggle />
      </div>
    </div>
  )
}
