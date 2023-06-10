import { useState } from "react"
import { User } from "@/api/users"
import { BadgeCheckIcon, Edit2Icon } from "lucide-react"

import { formatTimeAgo } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import UserAvatar from "@/components/user/avatar"
import { Button } from "../ui/button"
import UserForm from "./form"

export default function UserCenterHeading({ className = "", user }: { user: User; className?: string }) {
  const [formVisible, setFormVisible] = useState(false)

  const handleSaved = () => {
    setFormVisible(false)
  }

  return (
    <div className="text-forground relative rounded-lg border bg-primary-50/60 p-6 dark:bg-background lg:p-12">
      <div className="absolute inset-0 z-0 bg-[url(/background/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.3))]"></div>
      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} className="h-20 w-20 border text-2xl" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <h3 className="m-0 text-foreground">{user.name || user.id}</h3>
              {user.has_paid && <BadgeCheckIcon size={22} className="text-green-500" />}
            </div>
            <div>{user.email || user.phone_number}</div>
            <div className="text-forground text-sm">{formatTimeAgo(user.created_at)} 加入</div>
          </div>
        </div>
        <div>
          <Dialog open={formVisible} onOpenChange={setFormVisible}>
            <DialogTrigger>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit2Icon size={14} />
                编辑资料
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
              <UserForm user={user} onSaved={handleSaved} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
