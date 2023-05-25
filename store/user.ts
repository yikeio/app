import { create } from "zustand"

interface UserStore {
  user: Record<string, any>
  updateUser: (user: Record<string, string>) => void
}

export const useUserStore = create<UserStore>()((set, get) => ({
  user: {},
  updateUser(user: Record<string, string>) {
    set(() => ({ user }))
  },
}))
