import { ChefHatIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export default function Comming({ className = "" }) {
  return (
    <div className={cn(className, "flex min-h-[60vh] flex-col items-center justify-center gap-6 text-primary-400")}>
      <ChefHatIcon size={48} />
      <div className="text-primary-500">建设中...</div>
    </div>
  )
}
