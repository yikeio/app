import { ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import useAuth from "@/hooks/use-auth"
import classNames from "classnames"
import { CogIcon, CreditCardIcon, FlaskConicalIcon, GiftIcon, MessageSquare, TerminalSquareIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import UserDropdown from "./user-dropdown"

export function Navbar(props) {
  const router = useRouter()
  const { user, hasLogged } = useAuth()

  const NavItem = (item: { href?: string; name: string; icon: ReactNode; className?: string }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 items-center justify-start gap-4 rounded-xl text-slate-700 hover:bg-primary-200 hover:text-primary-700 dark:text-slate-400 lg:flex lg:w-full",
          {
            "bg-primary-200 text-primary-700": item.href && router.pathname === item.href,
          },
          item.className
        )}
        onClick={item.href ? () => router.push(item.href) : undefined}
      >
        {item.icon}
        <div className="hidden lg:block">{item.name}</div>
      </Button>
    )
  }

  return (
    <nav
      className={classNames(
        "fixed bottom-0 left-0 z-50 w-full lg:relative lg:w-60 transition-all bg-primary-50 flex lg:flex-col items-center lg:items-start justify-center lg:justify-start flex-shrink-0 lg:h-screen gap-6 md:gap-4 px-2 md:px-6 py-4 lg:py-8 border-t md:border-r border-r-slate-200 lg:border-t-0 border-primary-200  dark:border-b-slate-700 dark:bg-slate-900 ",
        props.className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="hidden w-full items-center justify-start gap-4 text-slate-700 hover:bg-primary-200 hover:text-primary-700 dark:text-slate-400 lg:flex"
        onClick={() => router.push("/")}
      >
        <Image src="/logo.svg" height={24} width={24} alt="logo" />
        <div className="hidden text-xl leading-none md:block">一刻 AI</div>
      </Button>
      <div className="flex w-full flex-1 justify-center gap-2 lg:flex-col lg:justify-start lg:py-4">
        <NavItem href="/prompts" name="对话" icon={<MessageSquare size={22} />} />
        <NavItem href="/invitations" name="邀请" icon={<GiftIcon size={22} />} />
        <NavItem href="/pricing" name="价格" icon={<CreditCardIcon size={22} />} />
        <NavItem href="/developers" name="开发者" icon={<TerminalSquareIcon size={22} />} />
        <NavItem href="/settings" className="hidden lg:flex" name="设置" icon={<CogIcon size={22} />} />
        <NavItem href="/discover" name="实验室" icon={<FlaskConicalIcon size={22} />} />

        <div className="hidden flex-1 lg:block"></div>

        {hasLogged && user && <UserDropdown user={user} />}
      </div>
    </nav>
  )
}
