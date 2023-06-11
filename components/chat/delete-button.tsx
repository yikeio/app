import { useState } from "react"
import { Trash2Icon } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"

export default function DeleteButton({ onClick }: { onClick: () => void }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onClick()
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-72">
        <DialogHeader>
          <div className="flex flex-col gap-6">
            <div>确定要删除当前对话么？</div>
            <small className="text-muted-foreground">如果当前场景中没有其它对话将会自动创建新的对话。</small>
            <div className="flex items-center gap-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                再考虑一下
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                删除
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
