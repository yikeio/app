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
          className="flex h-8 w-8 items-center justify-center p-1 hover:bg-muted"
        >
          <ListXIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-center">
        <AlertDialogHeader>确定要清空当前对话消息么？</AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <small className="text-muted-foreground">当前会话的所有消息将被删除，并且删除后不可恢复。</small>
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              再考虑一下
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              删除
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
