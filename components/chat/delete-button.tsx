import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"

export default function DeleteButton({ onClick }: { onClick: () => void }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onClick()
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex h-8 w-8 items-center justify-center p-1 hover:bg-muted">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>确定要删除当前对话么？</AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <small className="text-muted-foreground">如果当前场景中没有其它对话将会自动创建新的对话。</small>
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
