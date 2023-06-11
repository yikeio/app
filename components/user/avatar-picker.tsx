import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

/* eslint-disable @next/next/no-img-element */
export default function UserAvatarPicker({
  cols = 5,
  className = "",
  onSelected,
  children = undefined,
}: {
  cols?: number
  className?: string
  children?: React.ReactNode
  onSelected: (url: string) => void
}) {
  let images = []

  const [open, setOpen] = useState(false)

  for (let index = 1; index <= 30; index++) {
    images.push(`/avatars/memoji/${index}.png`)
  }

  const handleSelect = (url: string) => {
    onSelected(url)
    setOpen(false)
  }

  const trigger = children || (
    <Button variant="outline" size="sm">
      请选择
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择你喜欢的头像</DialogTitle>
          <DialogDescription>
            <div className={cn("grid grid-cols-5 gap-1", className)}>
              {images.map((url, index) => (
                <a
                  key={index}
                  className="block h-full w-full border border-transparent hover:scale-125 hover:border-primary"
                  onClick={() => handleSelect(url)}
                >
                  <img src={url} className="h-full w-full bg-white" alt={`avatar ${index}`} />
                </a>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
