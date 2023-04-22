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
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <BotIcon />
      <LoadingIcon />
    </div>
  ) : (
    <div className="flex">
      <Sidebar />
      <main className="flex min-h-screen flex-1 grow overflow-y-auto bg-slate-100">
        {children}
      </main>
    </div>
  )
}
