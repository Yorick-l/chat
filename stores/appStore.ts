import { create } from 'zustand'

type AppStore = {
  isDrawerOpen: boolean
  toggleDrawer: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  isDrawerOpen: true,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}))
