import { MoonIcon, SunDimIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function HomeThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-4">
      <a onClick={() => setTheme("light")} className={cn({ "text-primary-500": theme === "light" })}>
        <SunDimIcon size={20} />
        <span className="sr-only">浅色</span>
      </a>
      <a onClick={() => setTheme("dark")} className={cn({ "text-primary-500": theme === "dark" })}>
        <MoonIcon size={20} />
        <span className="sr-only">深色</span>
      </a>
    </div>
  )
}
