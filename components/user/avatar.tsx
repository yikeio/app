import { User } from "@/api/users"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function UserAvatar({
  className = "",
  url = null,
  name = "",
  user = null,
}: {
  className?: string
  url?: string
  name?: string
  user?: User
}) {
  const fallbackAvatarBackgroundColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  url = url || user?.avatar
  name = name || user?.name || (user?.id as unknown as string) || "-"
  const alphaNumber = name.toLowerCase().charCodeAt(0)

  const fallbackAvatarBackgroundColor =
    fallbackAvatarBackgroundColors[alphaNumber % fallbackAvatarBackgroundColors.length]

  return (
    <Avatar className={cn("h-5 w-5", className)}>
      {url && <AvatarImage src={url} />}
      <AvatarFallback className={cn(fallbackAvatarBackgroundColor)}>
        <span className="text-white">{name.substring(0, 1) || ""}</span>
      </AvatarFallback>
    </Avatar>
  )
}
