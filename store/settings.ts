import { getListUserSettings, updateListUserSettings } from "@/api/user"
import { create } from "zustand"

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export interface ChatConfig {
  chat_contexts_count: number // -1 means all
  chat_submit_key: SubmitKey
  avatar: string
  chat_font_size: number
}

const DEFAULT_CONFIG: ChatConfig = {
  chat_contexts_count: 3, //携带历史记录
  chat_submit_key: SubmitKey.Enter as SubmitKey, //发送键
  avatar: "1f603", //头像
  chat_font_size: 14, //字体大小
}

interface SettingsStore {
  config: ChatConfig
  getConfig: () => ChatConfig
  updateConfig: (
    updater: (config: ChatConfig) => void,
    userId: string,
    data: Record<string, any>
  ) => void

  getUserSettings: (userId: string) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>()((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  getConfig() {
    return get().config
  },

  async updateConfig(updater, userId, data = {}) {
    const config = get().config
    updater(config)
    await updateListUserSettings(userId, data)
    set(() => ({ config }))
  },

  // 获取用户配置
  async getUserSettings(userId: string) {
    const res = await getListUserSettings(userId)
    const config = res.result
    set(() => ({ config }))
  },
}))
