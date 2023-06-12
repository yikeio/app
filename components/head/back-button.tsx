import { useRouter } from "next/router"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "../ui/button"

export default function BackButton({ onClick = null }: { onClick?: () => void }) {
  const router = useRouter()
  onClick ??= () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex h-8 w-8 items-center justify-center p-1 text-muted-foreground hover:bg-muted "
      title="返回"
      onClick={onClick}
    >
      <ChevronLeftIcon size={18} />
    </Button>
  )
}
