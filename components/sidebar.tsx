import { useEffect, useState } from "react"
import Image from "next/image"
import { useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"
import { IconArrowAutofitContent } from "@tabler/icons-react"
import classNames from "classnames"
import { MessageSquare, Settings2, User, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Sidebar(props) {
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (isMobileScreen()) {
      setClosed(true)
    }
  }, [])

  const [user, setLoginModalVisible] = useUserStore((state) => [
    state.user,
    state.setLoginModalVisible,
  ])

  const handleClickNav = (url: string) => () => {
    if (!user.id) {
      setLoginModalVisible(true)
      return
    }
    location.href = url
  }

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
          "flex flex-col items-center flex-shrink-0 h-screen gap-6 px-2 py-4 bg-white border-r border-r-slate-200 dark:border-b-slate-700 dark:bg-slate-900 ",
          props.className,
          {
            hidden: closed,
          }
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
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
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-700 dark:text-slate-400"
          onClick={handleClickNav("/roles")}
        >
          <Wand2></Wand2>
          <span className="sr-only">角色</span>
        </Button>
        {/* 待页面支持暗黑模式后开启 */}
        {/* <ThemeToggle /> */}
      </aside>
    </div>
  )
}
