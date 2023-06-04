import { Trash2Icon } from "lucide-react"

import { Button } from "../ui/button"

export default function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      title="删除"
      variant="outline"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
    >
      <Trash2Icon className="h-4 w-4" />
    </Button>
  )
}
