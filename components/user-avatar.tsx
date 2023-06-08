import { User } from "@/api/users"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function UserAvatar({ className = "", user }: { className?: string; user: User }) {
  const fallbackAvatarBackgroundColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  const fallbackAvatarBackgroundColor = fallbackAvatarBackgroundColors[user.id % fallbackAvatarBackgroundColors.length]

  return (
    <Avatar className={cn("h-5 w-5", className)}>
      {user.avatar && <AvatarImage src={user.avatar} />}
      <AvatarFallback className={cn(fallbackAvatarBackgroundColor)}>
        <span className="text-sm text-white">{user.name?.substring(0, 1) || user.id.toString().substring(0, 1)}</span>
      </AvatarFallback>
    </Avatar>
  )
}
