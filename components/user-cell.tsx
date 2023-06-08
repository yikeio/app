import { User } from "@/api/users"

import { cn } from "@/lib/utils"
import UserAvatar from "./user-avatar"

export default function UserCell({ className = "", user }: { showRole?: boolean; className?: string; user: User }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} className={cn("h-5 w-5", className)} />
      <div className="flex items-center gap-2">
        <div>{user.name || user.id}</div>
      </div>
    </div>
  )
}
