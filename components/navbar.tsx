import { ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useUserStore } from "@/store"
import classNames from "classnames"
import {
  Cloud,
  CogIcon,
  CreditCard,
  FlaskConicalIcon,
  GiftIcon,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  MoreHorizontalIcon,
  Settings,
  TerminalIcon,
  TerminalSquareIcon,
  User,
  UserIcon,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function Navbar(props) {
  const router = useRouter()
  const [user, setLoginModalVisible] = useUserStore((state) => [
    state.user,
    state.setLoginModalVisible,
  ])

  const handleClickNav = (url: string) => () => {
    if (!user.id) {
      setLoginModalVisible(true)
      return
    }
    router.push(url)
  }

  console.log(router.pathname)

  const NavItem = (item: { href?: string; name: string; icon: ReactNode }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 items-center justify-start gap-4 text-slate-700 hover:bg-primary-200 hover:text-primary-700 dark:text-slate-400 md:flex md:w-full",
          {
            "bg-primary-200 text-primary-700":
              item.href && router.pathname === item.href,
          }
        )}
        onClick={item.href ? handleClickNav(item.href) : undefined}
      >
        {item.icon}
        <div className="hidden md:block">{item.name}</div>
      </Button>
    )
  }

  const fallbackAvatarBackgroundColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  const fallbackAvatarBackgroundColor =
    fallbackAvatarBackgroundColors[
      user.id % fallbackAvatarBackgroundColors.length
    ]

  return (
    <nav
      className={classNames(
        "fixed bottom-0 z-50 w-full md:relative md:w-60 transition-all bg-primary-50 flex md:flex-col items-center md:items-start justify-center md:justify-start flex-shrink-0 md:h-screen gap-6 md:gap-4 px-2 md:px-6 py-4 md:py-8 border-t md:border-t-0 md:border-r border-r-slate-200 dark:border-b-slate-700 dark:bg-slate-900 ",
        props.className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="hidden w-full items-center justify-start gap-4 text-slate-700 dark:text-slate-400 md:flex"
        onClick={handleClickNav("/")}
      >
        <Image src="/logo.svg" height={24} width={24} alt="logo" />
        <div className="hidden text-xl leading-none md:block">一刻 AI</div>
      </Button>
      <div className="flex w-full justify-center gap-2 md:flex-col md:justify-start md:py-4">
        <NavItem
          href="/prompts"
          name="对话"
          icon={<MessageSquare size={22} />}
        />
        <NavItem href="/user" name="我" icon={<UserIcon size={22} />} />
        <NavItem
          href="/discover"
          name="实验室"
          icon={<FlaskConicalIcon size={22} />}
        />
        <NavItem href="/discover" name="邀请" icon={<GiftIcon size={22} />} />
        <NavItem href="/settings" name="设置" icon={<CogIcon size={22} />} />
        <NavItem
          href="/api"
          name="API"
          icon={<TerminalSquareIcon size={22} />}
        />
      </div>
      {/* 待页面支持暗黑模式后开启 */}
      {/* <ThemeToggle /> */}
      {user.id && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="absolute bottom-0 left-0 flex w-full cursor-pointer items-center gap-4 border-t p-6">
              <Avatar className="h-8 w-8">
                {user.avatar && <AvatarImage src={user.avatar} />}
                <AvatarFallback
                  className={classNames(fallbackAvatarBackgroundColor)}
                >
                  <span className="text-sm text-white">
                    {user.name?.substring(0, 1) ||
                      user.id.toString().substring(0, 1)}
                  </span>
                </AvatarFallback>
              </Avatar>
              <div>{user.name}</div>
              <div className="ml-auto">
                <MoreHorizontalIcon size={20} />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => router.push("/user")}>
                <User className="mr-2 h-4 w-4" />
                <span>个人资料</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/user/payments")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>我的订单</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>系统设置</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>快捷键</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => router.push("/user/invitations")}
              >
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
    </nav>
  )
}
