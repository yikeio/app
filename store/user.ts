import { create } from "zustand"

interface UserStore {
  user: Record<string, any>
  updateUser: (user: Record<string, string>) => void

  loginModalVisible: boolean
  setLoginModalVisible: (visible: boolean) => void
}

export const useUserStore = create<UserStore>()((set, get) => ({
  user: {},
  updateUser(user: Record<string, string>) {
    set(() => ({ user }))
  },

  loginModalVisible: false,
  setLoginModalVisible(visible: boolean) {
    set(() => ({ loginModalVisible: visible }))
  },
}))
