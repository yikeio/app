import { Laptop2Icon, MoonIcon, SunDimIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-6">
      <div
        onClick={() => setTheme("light")}
        className={cn("flex items-center gap-4 rounded-lg border-2 p-4", {
          "border-primary-500": theme === "light",
        })}
      >
        <SunDimIcon size={32} />
        <span>浅色</span>
      </div>
      <div
        className={cn("flex items-center gap-4 rounded-lg border-2 p-4", {
          "border-primary-500": theme === "dark",
        })}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon size={32} />
        <span>深色</span>
      </div>
      <div
        className={cn("flex items-center gap-4 rounded-lg border-2 p-4", {
          "border-primary-500": theme === "system",
        })}
        onClick={() => setTheme("system")}
      >
        <Laptop2Icon size={32} />
        <span>自动</span>
      </div>
    </div>
  )
}
