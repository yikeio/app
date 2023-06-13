import { useState } from "react"
import { ListXIcon } from "lucide-react"

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"

export default function ClearButton({ onClick }: { onClick: () => void }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onClick()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          title="清空消息"
          variant="outline"
          className="hover:bg-muted flex h-8 w-8 items-center justify-center p-1"
        >
          <ListXIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <div className="flex flex-col gap-4">
            <div>确定要清空当前对话消息么？</div>
            <small className="text-muted-foreground">所有消息将被删除</small>
            <div className="flex items-center justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                再考虑一下
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                删除
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
