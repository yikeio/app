import classNames from "classnames"
import { ChefHatIcon } from "lucide-react"

export default function Comming({ className = "" }) {
  return (
    <div
      className={classNames(
        className,
        "flex flex-col gap-6 min-h-full items-center justify-center text-primary-400"
      )}
    >
      <ChefHatIcon size={48} />
      <div className="text-primary-500">建设中...</div>
    </div>
  )
}
