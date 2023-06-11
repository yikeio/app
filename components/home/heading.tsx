import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { HomeThemeToggle } from "./theme-toggle"

export default function HomeHeading() {
  const [open, setOpen] = useState(false)

  const Links = () => (
    <>
      <Link href="#pricing">价格</Link>
      <Link href="#download">下载</Link>
      <Link href="/prompts" className="rounded-full border border-muted-foreground px-4 py-1 text-sm">
        立即使用
      </Link>
      <HomeThemeToggle />
    </>
  )

  return (
    <div className="flex items-center justify-between">
      <Link className="inline-flex items-center justify-start gap-2 p-4  text-slate-700 dark:text-white " href="/">
        <Image src="/logo.svg" height={24} width={24} alt="logo" />
        <div className="text-xl leading-none ">一刻</div>
      </Link>
      <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
        <Links />
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent size="lg" position="right">
            <div className="flex flex-col gap-4">
              <Links />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
