import { useEffect, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import BotIcon from "../icons/bot.svg"
import LoadingIcon from "../icons/loading.svg"

interface LayoutProps {
  children: React.ReactNode
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}

export function Layout({ children }: LayoutProps) {
  const loading = !useHasHydrated()

  return loading ? (
    <div className="flex items-center justify-center h-screen gap-6">
      <BotIcon />
      <LoadingIcon />
    </div>
  ) : (
    <div className="flex">
      <Sidebar />
      <main className="h-screen overflow-y-auto grow">{children}</main>
    </div>
  )
}
