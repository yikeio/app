import { useEffect, useState } from "react"
import { Tag, getAllTags } from "@/api/tags"
import { MoreHorizontalIcon } from "lucide-react"
import useSWR from "swr"

import { cn } from "@/lib/utils"
import Loading from "./loading"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function TagsSelector({
  showCount = 10,
  align = "center",
  className = "",
  value = [],
  onValueChange,
}: {
  showCount?: number
  className?: string
  value?: Tag[] | (number | string)[]
  align?: "center" | "start" | "end"
  onValueChange?: (selectedTags: Tag[]) => void
}) {
  const { data: tags, error, isLoading } = useSWR(`tags`, getAllTags, { refreshInterval: 120 * 1000 })

  const [selectedTags, setSelectedTags] = useState([])

  if (tags && value && value.length > 0 && selectedTags.length <= 0) {
    const formattedValue = value.map((v) => {
      return typeof v !== "object" ? tags.find((t) => t.id == v) : v
    })

    setSelectedTags(formattedValue)
  }

  if (isLoading) {
    return <Loading />
  }

  const visibleTags = tags.slice(0, showCount)

  const toggleSelectTag = (tag: Tag) => {
    let newValue = []

    if (selectedTags.includes(tag)) {
      newValue = selectedTags.filter((t) => t.id !== tag.id)
    } else {
      newValue = [...selectedTags, tag]
    }

    setSelectedTags(newValue)
    onValueChange(newValue)
  }

  const hasBeenSelected = (tag: Tag) => {
    return selectedTags.includes(tag)
  }

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-4", className)}>
      {visibleTags.map((tag) => (
        <a
          key={tag.id}
          onClick={() => toggleSelectTag(tag)}
          className={cn("rounded-full border bg-primary-50 px-4 py-1 text-sm text-primary-500", {
            "border-primary-600 text-primary-600": hasBeenSelected(tag),
          })}
        >
          {tag.name}
        </a>
      ))}
      <Popover>
        <PopoverTrigger>
          <a id="tag-selector-trigger">
            <MoreHorizontalIcon
              className={cn("inline-block text-primary-500", {
                hidden: tags.length <= showCount,
              })}
            />
          </a>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[60vh] w-auto max-w-[90vw] overflow-y-auto lg:max-h-[60vh] lg:max-w-[40vw]"
          align={align}
        >
          <div className="flex flex-wrap items-center gap-4">
            {tags
              .filter((t) => !visibleTags.includes(t))
              .map((tag) => (
                <a
                  key={`popover-tag-${tag.id}`}
                  onClick={() => toggleSelectTag(tag)}
                  className={cn("rounded-full border bg-primary-50 px-4 py-1 text-sm text-primary-500", {
                    "border-primary-600 text-primary-600": hasBeenSelected(tag),
                  })}
                >
                  {tag.name}
                </a>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
