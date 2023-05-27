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
