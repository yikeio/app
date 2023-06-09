import { ClassValue, clsx } from "clsx"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { twMerge } from "tailwind-merge"

import "dayjs/locale/zh-cn"
import { toast } from "react-hot-toast"

dayjs.locale("zh-cn") // 全局使用

dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text.trim())
  } catch (error) {
    const textarea = document.createElement("textarea")
    textarea.value = text.trim()
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  } finally {
    toast.success("已复制")
  }
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

export function isMobileScreen() {
  if (typeof window === "undefined") return false
  return window.document.body.clientWidth <= 600
}

export function getScreenBreakpoint() {
  if (typeof window === "undefined") return "md"
  const width = window.document.body.clientWidth
  if (width <= 640) {
    return "sm"
  } else if (width <= 768) {
    return "md"
  } else if (width <= 1024) {
    return "lg"
  } else if (width <= 1280) {
    return "xl"
  } else if (width <= 1400) {
    return "2xl"
  } else {
    return "xxl"
  }
}

export function isScreenSize(size: "sm" | "md" | "lg" | "xl" | "2xl" | "xxl") {
  if (typeof window === "undefined") return false
  const width = window.document.body.clientWidth
  switch (size) {
    case "sm":
      return width <= 640
    case "md":
      return width <= 768 && width > 640
    case "lg":
      return width <= 1024 && width > 768
    case "xl":
      return width <= 1280 && width > 1024
    case "2xl":
      return width <= 1400 && width > 1280
    case "xxl":
      return width > 1400
    default:
      return false
  }
}

export function isScreenSizeAbove(size: "sm" | "md" | "lg" | "xl" | "2xl" | "xxl") {
  if (typeof window === "undefined") return false
  const width = window.document.body.clientWidth
  switch (size) {
    case "sm":
      return width > 640
    case "md":
      return width > 768
    case "lg":
      return width > 1024
    case "xl":
      return width > 1280
    case "2xl":
      return width > 1400
    case "xxl":
      return width > 1680
    default:
      return false
  }
}

export function downloadAs(text: string, filename: string) {
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
  element.setAttribute("download", filename)

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export function formatTimeAgo(dateStr) {
  const date = dayjs(dateStr)
  return date.fromNow()
}

export function formatDatetime(dateStr, format = "YYYY-MM-DD HH:mm") {
  const date = dayjs(dateStr)
  return date.format(format)
}

export function formatRelativeTime(timeStr: string) {
  // 将传入的时间字符串解析为 Day.js 对象
  const time = dayjs(timeStr)

  // 计算消息发送时间与当前时间的差距
  const diff = dayjs().diff(time, "minute")

  if (diff < 5) {
    // 当消息发送时间在5分钟以内，则显示为刚刚
    return "刚刚"
  } else if (diff < 144) {
    // 当消息发送时间在1天以内，则按每5分钟为一个跨度显示时间
    const minutes = Math.floor(diff / 5) * 5
    return `${time.format("HH:mm").replace(/^/, "")}:${minutes}`
  } else if (diff < 10080) {
    // 当消息发送时间在1周以内，则显示为星期消息发送时间
    return time.format("dddd HH:mm").replace(/^星期/, "")
  } else {
    // 当消息发送时间超过1周，则显示为日期消息发送时间
    return time.format("YYYY-MM-DD HH:mm")
  }
}

export function formatNumber(number: string | number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function speak(text: string) {
  return window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
}
