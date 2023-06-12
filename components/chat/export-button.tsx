import { Share2Icon } from "lucide-react"

import { Button } from "../ui/button"

export default function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      title="分享"
      variant="outline"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center p-1 hover:bg-muted "
    >
      <Share2Icon className="h-4 w-4" />
    </Button>
  )
}
