import { create } from 'zustand'

export type ViewKey = 'home' | 'agents' | 'gallery' | 'dashboard' | 'faq' | 'admin'

export interface PropertyDetailState {
  open: boolean
  propertyId: string | null
}

interface AppState {
  view: ViewKey
  setView: (v: ViewKey) => void
  authOpen: boolean
  setAuthOpen: (b: boolean) => void
  isAuthed: boolean
  setAuthed: (b: boolean) => void
  userName: string | null
  setUserName: (n: string | null) => void
  propertyDetail: PropertyDetailState
  openPropertyDetail: (id: string) => void
  closePropertyDetail: () => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'home',
  setView: (v) => {
    set({ view: v })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  authOpen: false,
  setAuthOpen: (b) => set({ authOpen: b }),
  isAuthed: false,
  setAuthed: (b) => set({ isAuthed: b }),
  userName: null,
  setUserName: (n) => set({ userName: n }),
  propertyDetail: { open: false, propertyId: null },
  openPropertyDetail: (id) => set({ propertyDetail: { open: true, propertyId: id } }),
  closePropertyDetail: () => set({ propertyDetail: { open: false, propertyId: null } }),
}))
