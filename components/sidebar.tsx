import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"
import classNames from "classnames"
import { MessageSquare, Settings2, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Sidebar(props) {
  const router = useRouter()
  const [user, setLoginModalVisible] = useUserStore((state) => [
    state.user,
    state.setLoginModalVisible,
  ])

  const [show, setShow] = useState(true)

  const handleClickNav = (url: string) => () => {
    if (!user.id) {
      setLoginModalVisible(true)
      return
    }
    router.push(url)
  }

  useEffect(() => {
    if (!isMobileScreen()) {
      return
    }
    setShow(!router.asPath.includes("#hide-nav"))
  }, [router])

  return (
    <div
      className={classNames(
        "fixed bottom-0 z-50 w-full md:relative md:w-auto transition-all",
        show ? "" : "-mb-20"
      )}
    >
      <aside
        className={classNames(
          "flex md:flex-col items-center justify-center md:justify-start flex-shrink-0 md:h-screen gap-6 px-2 py-2 md:py-4 bg-white border-t md:border-t-0 md:border-r border-r-slate-200 dark:border-b-slate-700 dark:bg-slate-900 ",
          props.className
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-slate-700 dark:text-slate-400 md:block"
          onClick={handleClickNav("/")}
        >
          <Image src="/logo.svg" height={24} width={24} alt="logo" />
          <span className="sr-only">首页</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
          onClick={handleClickNav("/chat")}
        >
          <MessageSquare></MessageSquare>
          <span className="sr-only">会话</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
          onClick={handleClickNav("/user")}
        >
          <User></User>
          <span className="sr-only">我的</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
          onClick={handleClickNav("/settings")}
        >
          <Settings2></Settings2>
          <span className="sr-only">设置</span>
        </Button>
        {/* 待页面支持暗黑模式后开启 */}
        {/* <ThemeToggle /> */}
      </aside>
    </div>
  )
}
