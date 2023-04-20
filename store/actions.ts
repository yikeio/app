import { create } from "zustand"

type ActionsStore = {
  mode: 'select' | 'normal'
  setMode: (mode: 'select' | 'normal') => void

  selectedMessages: string[]
  setSelectedMessages: (selected: string[]) => void

  exportImageVisible: boolean
  setExportImageVisible: (visible: boolean) => void
}

export const useActionsStore = create<ActionsStore>()((set, get) => ({
  mode: 'normal',
  setMode: (mode: 'select' | 'normal') => {
    set(() => ({ mode }))
  },

  selectedMessages: [],
  setSelectedMessages: (selected: string[]) => {
    set(() => ({ selectedMessages: selected }))
  },

  exportImageVisible: false,
  setExportImageVisible: (visible: boolean) => {
    set(() => ({ exportImageVisible: visible }))
  }
}))
