import { ListXIcon } from "lucide-react"

import { Button } from "../ui/button"

export default function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      title="清空消息"
      variant="outline"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
    >
      <ListXIcon className="h-4 w-4" />
    </Button>
  )
}
