import router from "next/router"
import { User } from "@/api/users"
import useAuth from "@/hooks/use-auth"
import {
  Cloud,
  CreditCard,
  GiftIcon,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  MoreHorizontalIcon,
  Settings,
  UserIcon,
  Users,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import UserCell from "./user/cell"

export default function UserDropdown({ user }: { user: User }) {
  const auth = useAuth()
  const handleLogout = () => {
    auth.logout()
    auth.redirectToLogin()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mt-auto flex cursor-pointer items-center gap-4 overflow-hidden p-2 lg:relative lg:w-full lg:place-self-end lg:border-t lg:pt-6">
          <div className="hidden flex-1 overflow-hidden lg:block">
            <UserCell user={user} className="h-8 w-8 text-foreground" />
          </div>
          <div className="ml-auto shrink-0">
            <MoreHorizontalIcon size={20} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => router.push("/user")}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>个人资料</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/user?tab=payments")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>我的订单</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/user?tab=invitations")}>
            <Users className="mr-2 h-4 w-4" />
            <span>我的邀请</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push("/gift-cards")}>
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
        <DropdownMenuItem className="text-destructive dark:text-red-600" onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>注销登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
