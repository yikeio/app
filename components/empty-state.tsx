import { PackageOpen } from "lucide-react"

export default function EmptyState({ message = "暂无数据", className = "" }) {
  return (
    <div
      className={
        `flex h-full flex-col items-center justify-center ` + className
      }
    >
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <PackageOpen />
        {message && message.length && <div className="text-sm">{message} </div>}
      </div>
    </div>
  )
}
