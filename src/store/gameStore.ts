import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState } from '../types'

interface GameStore extends GameState {
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
  setApiKey: (apiKey: string) => void
  unlockRewindAbility: () => void
  resetGame: () => void
}

const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentLevel: null,
      unlockedLevels: ['intro'],
      completedLevels: [],
      hasRewindAbility: false,
      apiKey: null,

      setCurrentLevel: (levelId) => set({ currentLevel: levelId }),

      unlockLevel: (levelId) => set((state) => ({
        unlockedLevels: [...new Set([...state.unlockedLevels, levelId])]
      })),

      completeLevel: (levelId) => set((state) => ({
        completedLevels: [...new Set([...state.completedLevels, levelId])]
      })),

      setApiKey: (apiKey) => set({ apiKey }),

      unlockRewindAbility: () => set({ hasRewindAbility: true }),

      resetGame: () => set({
        currentLevel: null,
        unlockedLevels: ['intro'],
        completedLevels: [],
        hasRewindAbility: false,
        apiKey: null
      })
    }),
    {
      name: 'amur-isondo-game-storage'
    }
  )
)

export default useGameStore