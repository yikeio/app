import { ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import useAuth from "@/hooks/use-auth"
import { useUserStore } from "@/store"
import classNames from "classnames"
import {
  Cloud,
  CogIcon,
  CreditCard,
  CreditCardIcon,
  FlaskConicalIcon,
  GiftIcon,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  MoreHorizontalIcon,
  Settings,
  TerminalSquareIcon,
  User,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import UserCell from "./user-cell"

export function Navbar(props) {
  const router = useRouter()
  const { user, hasLogged } = useAuth()

  const NavItem = (item: {
    href?: string
    name: string
    icon: ReactNode
    className?: string
  }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 items-center justify-start gap-4 rounded-xl text-slate-700 hover:bg-primary-200 hover:text-primary-700 dark:text-slate-400 lg:flex lg:w-full",
          {
            "bg-primary-200 text-primary-700":
              item.href && router.pathname === item.href,
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
        <NavItem
          href="/prompts"
          name="对话"
          icon={<MessageSquare size={22} />}
        />
        <NavItem
          href="/invitations"
          name="邀请"
          icon={<GiftIcon size={22} />}
        />
        <NavItem
          href="/pricing"
          name="价格"
          icon={<CreditCardIcon size={22} />}
        />
        <NavItem
          href="/developers"
          name="开发者"
          icon={<TerminalSquareIcon size={22} />}
        />
        <NavItem
          href="/settings"
          className="hidden lg:flex"
          name="设置"
          icon={<CogIcon size={22} />}
        />
        <NavItem
          href="/discover"
          name="实验室"
          icon={<FlaskConicalIcon size={22} />}
        />

        <div className="hidden flex-1 lg:block"></div>

        {hasLogged && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="mt-auto flex cursor-pointer items-center gap-4 p-2 lg:relative lg:w-full lg:place-self-end lg:border-t lg:pt-6">
                <div className="hidden lg:block">
                  <UserCell user={user} className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-auto">
                  <MoreHorizontalIcon size={20} />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => router.push("/user")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>个人资料</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push("/user/payments")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>我的订单</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/invitations")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>我的邀请</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push("/user/gift-cards")}
                >
                  <GiftIcon className="mr-2 h-4 w-4" />
                  <span>礼品卡</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>系统设置</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Keyboard className="mr-2 h-4 w-4" />
                  <span>快捷键</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>客户服务</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>注销登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}
