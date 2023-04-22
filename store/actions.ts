import { create } from "zustand"
import { Message } from './app'

type ActionsStore = {
  mode: 'select' | 'normal'
  setMode: (mode: 'select' | 'normal') => void

  selectedMessages: Message[]
  setSelectedMessages: (selected: Message[]) => void

  exportImageVisible: boolean
  setExportImageVisible: (visible: boolean) => void
}

export const useActionsStore = create<ActionsStore>()((set, get) => ({
  mode: 'normal',
  setMode: (mode: 'select' | 'normal') => {
    set(() => ({ mode }))
  },

  selectedMessages: [],
  setSelectedMessages: (selected: Message[]) => {
    set(() => ({ selectedMessages: selected }))
  },

  exportImageVisible: false,
  setExportImageVisible: (visible: boolean) => {
    set(() => ({ exportImageVisible: visible }))
  }
}))
