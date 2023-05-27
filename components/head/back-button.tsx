import { useRouter } from "next/router"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "../ui/button"

export default function BackButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex h-8 w-8 items-center justify-center p-1 text-gray-500"
      title="返回"
      onClick={() => router.back()}
    >
      <ChevronLeftIcon size={18} />
    </Button>
  )
}
