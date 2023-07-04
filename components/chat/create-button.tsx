import { PlusIcon } from "lucide-react"

import { Button } from "../ui/button"

export default function CreateButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="flex w-full items-center justify-center gap-2" onClick={onClick}>
        <PlusIcon size={22} />
        <span>开启新的对话</span>
      </Button>
    </div>
  )
}
