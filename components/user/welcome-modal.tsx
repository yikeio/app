import { useEffect, useState } from "react"
import { User } from "@/api/users"
import useLocalStorage from "@/hooks/use-localstorage"
import dayjs from "dayjs"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "../ui/button"

export default function WelcomeModal({ user }: { user: User }) {
  // 一分钟内注册的用户显示欢迎弹窗
  const isUserRecentCreated = dayjs(user.created_at).isAfter(dayjs().subtract(1, "minute"))
  const [open, setOpen] = useState(isUserRecentCreated)
  const [hasSeen, setHasSeen] = useLocalStorage("welcome-modal-seen", !isUserRecentCreated)

  useEffect(() => {
    if (hasSeen) {
      setOpen(false)
    }
  }, [hasSeen])

  const handleClose = () => {
    setOpen(false)
    setHasSeen(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>欢迎您来到一刻！🎉 </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="text-muted-foreground">
            我们已经为您的账户赠送了免费体验额度，希望您能够喜欢我们的产品。如果您有任何问题，欢迎随时联系我们。
          </div>
          <div className="flex items-center justify-center">
            <Button onClick={handleClose} className="w-24">
              开始体验
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
