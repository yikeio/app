import { User } from "@/api/users"
import { BadgeCheckIcon, Edit2Icon } from "lucide-react"

import { formatTimeAgo } from "@/lib/utils"
import UserAvatar from "@/components/user-avatar"
import { Button } from "../ui/button"

export default function UserCenterHeading({ className = "", user }: { user: User; className?: string }) {
  return (
    <div className="relative rounded-lg border bg-primary-50/60 p-6 lg:p-12">
      <div className="absolute inset-0 z-0 bg-[url(/background/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.3))]"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} className="h-20 w-20 text-2xl" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="m-0">{user.name || user.id}</h3>
              {user.has_paid && <BadgeCheckIcon size={22} className="text-green-500" />}
            </div>
            <div>{user.email || user.phone_number}</div>
            <div className="text-gray-500">{formatTimeAgo(user.created_at)} 加入</div>
          </div>
        </div>
        <div>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2Icon size={14} />
            编辑资料
          </Button>
        </div>
      </div>
    </div>
  )
}
