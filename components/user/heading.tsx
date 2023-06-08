import { User } from "@/api/users"

import UserAvatar from "@/components/user-avatar"

export default function UserCenterHeading({ className = "", user }: { user: User; className?: string }) {
  return (
    <div className="rounded-lg border p-6 lg:p-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} className="h-20 w-20" />
          <div className="flex flex-col gap-2">
            <h3 className="m-0">{user.name || user.id}</h3>
            <div>{user.email || user.phone_number}</div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
