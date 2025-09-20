export interface GameLevel {
  id: string
  title: string
  description: string
  question: string
  targetTopic: string
  persona: string
  context?: string
  validationCriteria?: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  unlockAfter?: string // ID of level that must be completed to unlock this one
  category: 'introduction' | 'history' | 'science' | 'philosophy' | 'literature' | 'technology'
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