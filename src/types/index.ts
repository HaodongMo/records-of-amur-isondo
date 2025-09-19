export interface GameLevel {
  id: string
  title: string
  description: string
  question: string
  unlocked: boolean
  completed: boolean
}

export interface PersonaTag {
  id: string
  name: string
  description: string
  category: 'personality' | 'expertise' | 'style' | 'background'
}

export interface Persona {
  id: string
  name: string
  description: string
  tags: PersonaTag[]
  systemPrompt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface GameState {
  currentLevel: string | null
  unlockedLevels: string[]
  completedLevels: string[]
  hasRewindAbility: boolean
  apiKey: string | null
}

export interface PredefinedQuery {
  id: string
  text: string
  category: 'direct' | 'exploratory' | 'clarifying'
}