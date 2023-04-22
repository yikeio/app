import { ClassValue, clsx } from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { twMerge } from "tailwind-merge"

import "dayjs/locale/zh-cn"

dayjs.locale("zh-cn") // 全局使用

dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateStr) {
  const date = dayjs(dateStr)
  return date.fromNow()
}

export function formatDatetime(dateStr, format = "YYYY-MM-DD HH:mm:ss") {
  const date = dayjs(dateStr)
  return date.format(format)
}
