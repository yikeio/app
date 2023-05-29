import { useEffect } from "react"
import { useRouter } from "next/router"
import { useUserStore } from "@/store"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/prompts")
  })

  return <div className="flex h-screen items-center justify-center">Loading...</div>
}
