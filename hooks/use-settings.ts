import UserApi from "@/api/users"
import useSWR from "swr"

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

export const DEFAULT_CONFIG: Settings = {
  chat_contexts_count: 3, //携带历史记录
  chat_submit_key: SubmitKey.Enter as SubmitKey, //发送键
  chat_font_size: 14, //字体大小
}

export default function useSettings() {
  const { data, error, isLoading, mutate } = useSWR(`settings`, () => UserApi.getSettings())

  const updateSetting = async (key: string, value: any) => {
    await UserApi.updateSettingItem(key, value)
    mutate()
  }

  return {
    settings: data,
    isLoading,
    error,
    refresh: mutate,
    updateSetting,
  }
}
