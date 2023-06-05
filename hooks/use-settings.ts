import { useEffect } from "react"
import { getSettings } from "@/api/users"
import useSWR from "swr"

import useAuth from "./use-auth"

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export interface Settings {
  chat_contexts_count: number // -1 means all
  chat_submit_key: SubmitKey
  chat_font_size: number
}

const DEFAULT_CONFIG: Settings = {
  chat_contexts_count: 3, //携带历史记录
  chat_submit_key: SubmitKey.Enter as SubmitKey, //发送键
  chat_font_size: 14, //字体大小
}

export default function useSettings() {
  const { user } = useAuth()
  const { data = DEFAULT_CONFIG, error, isLoading, mutate } = useSWR(`settings`, () => getSettings())

  const updateSettings = (key: string, value: any) => {
    updateSettings(key, value)
    mutate()
  }

  useEffect(() => {
    mutate()
  }, [mutate, user])

  return {
    settings: data,
    isLoading,
    error,
    refresh: mutate,
    updateSettings,
  }
}
