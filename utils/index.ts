import toast from "react-hot-toast"

import Locale from "../locales"

// server time will ahead of client time about 1 second
export function getCurrentDate() {
  const date = new Date()
  date.setSeconds(0)
  return date
}

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？、,.!?]*$/, "")
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

export function downloadAs(text: string, filename: string) {
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  )
  element.setAttribute("download", filename)

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export function parseTime(time: string): string {
  if (!time) return ""

  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent)
}

export function isMobileScreen() {
  if (typeof window === "undefined") return false
  return window.outerWidth <= 600
}

export function selectOrCopy(el: HTMLElement, content: string) {
  const currentSelection = window.getSelection()

  if (currentSelection?.type === "Range") {
    return false
  }

  copyToClipboard(content)

  return true
}

export function queryMeta(key: string, defaultValue?: string): string {
  let ret: string
  if (document) {
    const meta = document.head.querySelector(
      `meta[name='${key}']`
    ) as HTMLMetaElement
    ret = meta?.content ?? ""
  } else {
    ret = defaultValue ?? ""
  }

  return ret
}

let currentId: string
export function getCurrentVersion() {
  if (currentId) {
    return currentId
  }

  currentId = queryMeta("version")

  return currentId
}
