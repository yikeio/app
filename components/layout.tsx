import { SiteHeader } from "@/components/site-bar"
import { useState, useEffect } from "react";

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
  const loading = !useHasHydrated();

  return loading ? (
    <div className="h-screen flex items-center justify-center gap-6">
      <BotIcon />
      <LoadingIcon />
    </div>
  ) : (
    <div className="flex">
      <SiteHeader />
      <main className="grow h-screen overflow-y-auto">{children}</main>
    </div>
  )
}
