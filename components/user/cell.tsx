import { User } from "@/api/users"

import { cn } from "@/lib/utils"
import UserAvatar from "./avatar"

export default function UserCell({ className = "", user }: { showRole?: boolean; className?: string; user: User }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar url={user.avatar} name={user.name} className={cn("h-5 w-5 shrink-0", className)} />
      <div className="flex items-center gap-2">
        <div className="truncate">{user.name || user.id}</div>
      </div>
    </div>
  )
}
