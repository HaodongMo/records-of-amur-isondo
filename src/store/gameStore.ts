import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GameLevel } from '../types'
import { GAME_LEVELS } from '../data/levels'

interface GameStore extends GameState {
  levels: GameLevel[]
  getLevel: (levelId: string) => GameLevel | undefined
  getNextLevel: (levelId: string) => GameLevel | undefined
  getUnlockedLevels: () => GameLevel[]
  getCompletedLevels: () => GameLevel[]
  isLevelUnlocked: (levelId: string) => boolean
  isLevelCompleted: (levelId: string) => boolean
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
  setApiKey: (apiKey: string) => void
  unlockRewindAbility: () => void
  resetGame: () => void
}

const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      levels: GAME_LEVELS,
      currentLevel: null,
      unlockedLevels: ['intro'],
      completedLevels: [],
      hasRewindAbility: false,
      apiKey: null,

      getLevel: (levelId) => {
        const state = get()
        return state.levels.find(level => level.id === levelId)
      },

      getNextLevel: (levelId) => {
        const state = get()
        const currentIndex = state.levels.findIndex(level => level.id === levelId)
        if (currentIndex === -1 || currentIndex === state.levels.length - 1) {
          return undefined // No next level
        }
        return state.levels[currentIndex + 1]
      },

      getUnlockedLevels: () => {
        const state = get()
        return state.levels.filter(level => state.unlockedLevels.includes(level.id))
      },

      getCompletedLevels: () => {
        const state = get()
        return state.levels.filter(level => state.completedLevels.includes(level.id))
      },

      isLevelUnlocked: (levelId) => {
        const state = get()
        return state.unlockedLevels.includes(levelId)
      },

      isLevelCompleted: (levelId) => {
        const state = get()
        return state.completedLevels.includes(levelId)
      },

      setCurrentLevel: (levelId) => {
        set({ currentLevel: levelId })
      },

      unlockLevel: (levelId) => {
        set((state) => ({
          unlockedLevels: state.unlockedLevels.includes(levelId)
            ? state.unlockedLevels
            : [...state.unlockedLevels, levelId]
        }))
      },

      completeLevel: (levelId) => {
        set((state) => {
          const completedLevel = state.levels.find(level => level.id === levelId)
          if (!completedLevel) return state

          const newCompletedLevels = state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId]

          // Auto-unlock next levels based on unlockAfter dependency
          const newUnlockedLevels = [...state.unlockedLevels]
          state.levels.forEach(level => {
            if (
              level.unlockAfter === levelId && !state.unlockedLevels.includes(level.id)
            ) {
              newUnlockedLevels.push(level.id)
            }
          })

          return {
            ...state,
            completedLevels: newCompletedLevels,
            unlockedLevels: newUnlockedLevels
          }
        })
      },

      setApiKey: (apiKey) => {
        set({ apiKey })
      },

      unlockRewindAbility: () => {
        set({ hasRewindAbility: true })
      },

      resetGame: () => {
        set({
          currentLevel: null,
          unlockedLevels: ['intro'],
          completedLevels: [],
          hasRewindAbility: false
        })
      }
    }),
    {
      name: 'game-store',
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        unlockedLevels: state.unlockedLevels,
        completedLevels: state.completedLevels,
        hasRewindAbility: state.hasRewindAbility,
        apiKey: state.apiKey
      })
    }
  )
)

export default useGameStore