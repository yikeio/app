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
    <div className="flex flex-col h-screen items-center justify-center gap-6">
      <BotIcon />
      <LoadingIcon />
    </div>
  ) : (
    <div className="flex">
      <Sidebar />
      <main className="flex flex-1 min-h-screen grow overflow-y-auto bg-slate-100">
        {children}
      </main>
    </div>
  )
}
