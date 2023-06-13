import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export default function AbortButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center gap-4">
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              className="flex h-14 w-14 items-center gap-2 rounded-full border-4 border-primary-50/90 dark:border-primary-100/10"
              onClick={onClick}
            >
              <div className="h-3 w-3 bg-white"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>停止生成</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
