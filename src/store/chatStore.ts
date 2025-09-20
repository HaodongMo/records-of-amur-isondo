import { create } from 'zustand'
import Cookies from 'js-cookie'
import { openRouterService } from '../lib/openrouter'
import useGameStore from './gameStore'

interface ChatMessage {
  id: number
  sender: string
  text: string
  isUser: boolean
}

interface GameConfig {
  persona: string
  question: string
  targetTopic: string
  context?: string
  validationCriteria?: string[]
}

interface QuestionOption {
  id: string
  text: string
}

interface ChatState {
  apiKey: string | null
  config: GameConfig
  messages: ChatMessage[]
  questionOptions: QuestionOption[]
  isLoading: boolean
  isGeneratingQuestions: boolean
  hasWon: boolean
  error: string | null
  isInitialized: boolean
  isInitializing: boolean
  characterName: string
  hasCustomPersona: boolean
  currentLevelId: string | null

  // Actions
  setApiKey: (key: string) => void
  clearApiKey: () => void
  setConfig: (config: Partial<GameConfig>) => void
  setCharacterName: (name: string) => void
  setCurrentLevelId: (levelId: string | null) => void
  addMessage: (message: Omit<ChatMessage, 'id'>) => void
  clearMessages: () => void
  resetGameState: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setQuestionOptions: (options: QuestionOption[]) => void
  initializeChat: () => Promise<void>

  // LLM Actions
  sendUserMessage: (message: string) => Promise<void>
  initializeApiKey: () => Promise<void>
  loadApiKeyFromCookie: () => void
  generateInitialQuestions: () => Promise<void>
  generateFollowUpQuestions: () => Promise<void>
  undoLastTurn: () => Promise<void>
}

const API_KEY_COOKIE = 'openrouter_api_key'

// Helper function to extract character name from persona
const extractCharacterName = (persona: string): string => {
  // Try to extract name from common patterns
  const patterns = [
    /^(?:the\s+)?(.+?),\s+who/i,  // "the Egyptian God, Anubis, who..."
    /^(?:the\s+)?(.+?)\s+who/i,   // "Anubis who..."
    /^(?:the\s+)?(.+?)\./i,       // "the Egyptian God, Anubis."
    /^(?:the\s+)?(.+?)$/i         // fallback to full persona
  ]

  for (const pattern of patterns) {
    const match = persona.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }

  return persona
}

export const useChatStore = create<ChatState>((set, get) => ({
  apiKey: null,
  config: {
    persona: '',
    question: '',
    targetTopic: '',
    context: '',
    validationCriteria: []
  },
  messages: [],
  questionOptions: [],
  isLoading: false,
  isGeneratingQuestions: false,
  hasWon: false,
  error: null,
  isInitialized: false,
  isInitializing: false,
  characterName: '',
  hasCustomPersona: false,
  currentLevelId: null,

  setApiKey: (key) => {
    set({ apiKey: key })
    openRouterService.setApiKey(key)
    // Save to cookie with 30 day expiration
    Cookies.set(API_KEY_COOKIE, key, { expires: 30 })
  },

  clearApiKey: () => {
    set({ apiKey: null })
    Cookies.remove(API_KEY_COOKIE)
  },

  loadApiKeyFromCookie: () => {
    const savedKey = Cookies.get(API_KEY_COOKIE)
    if (savedKey) {
      set({ apiKey: savedKey })
      openRouterService.setApiKey(savedKey)
    }
  },

  setConfig: (newConfig) => set((state) => {
    const updatedConfig = { ...state.config, ...newConfig }
    let characterName = state.characterName

    // If persona is being updated, extract character name
    if (newConfig.persona) {
      characterName = extractCharacterName(newConfig.persona)
      console.log(`🎭 Extracted character name: "${characterName}" from persona: "${newConfig.persona}"`)
    }

    return {
      config: updatedConfig,
      characterName,
      hasCustomPersona: true
    }
  }),

  setCharacterName: (name: string) => set({ characterName: name }),

  setCurrentLevelId: (levelId: string | null) => set({ currentLevelId: levelId }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),

  clearMessages: () => set({ messages: [], hasWon: false, isInitialized: false, isInitializing: false }),

  resetGameState: () => set({
    config: {
      persona: '',
      question: '',
      targetTopic: '',
      context: '',
      validationCriteria: []
    },
    messages: [],
    questionOptions: [],
    isLoading: false,
    isGeneratingQuestions: false,
    hasWon: false,
    error: null,
    isInitialized: false,
    isInitializing: false,
    characterName: '',
    hasCustomPersona: false,
    currentLevelId: null
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setQuestionOptions: (options) => set({ questionOptions: options }),

  initializeApiKey: async () => {
    const state = get()
    // First try to load from cookie
    if (!state.apiKey) {
      state.loadApiKeyFromCookie()
    }

    // If still no API key, prompt user
    if (!state.apiKey) {
      const key = prompt('Please enter your OpenRouter API key:\n\n(This will be saved securely in your browser for future use)')
      if (key && key.trim()) {
        state.setApiKey(key.trim())
      } else {
        throw new Error('API key is required')
      }
    }
  },

  sendUserMessage: async (message: string) => {
    const state = get()

    try {
      // Ensure API key is set
      await state.initializeApiKey()

      state.setLoading(true)
      state.setError(null)

      // Add user message
      state.addMessage({
        sender: 'USER',
        text: message,
        isUser: true
      })

      // Step 1: Get initial answer from persona
      const answer = await openRouterService.answerQuestion(
        state.config.persona,
        state.characterName,
        message,
        state.config.context
      )

      // Add AI response
      state.addMessage({
        sender: state.characterName.toUpperCase(),
        text: answer,
        isUser: false
      })

      // Step 2: Run evaluation and new question generation concurrently
      const [isAnswered] = await Promise.all([
        openRouterService.evaluateAnswer(
          state.config.question,
          answer,
          state.config.targetTopic,
          state.config.validationCriteria || []
        ),
        // Generate new follow-up questions based on the conversation
        state.generateFollowUpQuestions()
      ])

      console.log('Question answered adequately:', isAnswered)

      // Check for win condition
      if (isAnswered && !state.hasWon) {
        set({ hasWon: true })

        // If we're in a level, mark it as completed
        if (state.currentLevelId) {
          const gameStore = useGameStore.getState()
          gameStore.completeLevel(state.currentLevelId)
          console.log(`🏆 Level completed: ${state.currentLevelId}`)
        }

        // For levels, the ChatPage will navigate to victory screen automatically
        // For random mode, show the alert
        if (!state.currentLevelId) {
          alert(`🎉 Congratulations! You've successfully learned about ${state.config.targetTopic}!\n\nYou can continue the conversation or start a new topic.`)
        }
      }

    } catch (error) {
      console.error('Error in sendUserMessage:', error)
      state.setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      state.setLoading(false)
    }
  },

  generateInitialQuestions: async () => {
    const state = get()

    try {
      await state.initializeApiKey()
      set({ isGeneratingQuestions: true, error: null })

      const questions = await openRouterService.generateQuestions(
        state.config.persona,
        state.config.context || '',
        [],
        state.config.targetTopic,
        state.config.question
      )

      state.setQuestionOptions(questions)
    } catch (error) {
      console.error('Error generating initial questions:', error)
      state.setError(error instanceof Error ? error.message : 'Failed to generate questions')
    } finally {
      set({ isGeneratingQuestions: false })
    }
  },

  generateFollowUpQuestions: async () => {
    const state = get()

    try {
      await state.initializeApiKey()
      set({ isGeneratingQuestions: true, error: null, hasWon: false })

      // Convert ALL messages to ChatMessage format for the API, including the greeting
      const chatHistory: import('../lib/openrouter').ChatMessage[] = state.messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }))

      console.log(`🎲 Generating questions with full chat history (${chatHistory.length} messages):`, chatHistory)

      const questions = await openRouterService.generateQuestions(
        state.config.persona,
        state.config.context || '',
        chatHistory,
        state.config.targetTopic,
        state.config.question
      )

      state.setQuestionOptions(questions)
    } catch (error) {
      console.error('Error generating follow-up questions:', error)
      state.setError(error instanceof Error ? error.message : 'Failed to generate follow-up questions')
    } finally {
      set({ isGeneratingQuestions: false })
    }
  },


  initializeChat: async () => {
    const state = get()

    // Prevent concurrent initialization
    if (state.isInitialized || state.isInitializing) return

    try {
      set({ isInitializing: true })
      await state.initializeApiKey()

      console.log('Starting initialization - generating greeting...')

      // Generate only the greeting on initialization
      const greeting = await openRouterService.generateGreeting(
        state.config.persona,
        state.characterName,
        state.config.context || ''
      )

      console.log('Initialization complete - adding greeting message')

      // Add greeting message to state
      state.addMessage({
        sender: state.characterName.toUpperCase(),
        text: greeting,
        isUser: false
      })

      // Generate initial questions after greeting is added
      await state.generateInitialQuestions()

      // Mark as initialized only AFTER all API calls succeed
      set({ isInitialized: true, isInitializing: false })

    } catch (error) {
      console.error('Error initializing chat:', error)
      state.setError(error instanceof Error ? error.message : 'Failed to initialize chat')
      set({ isInitializing: false })
    }
  },

  undoLastTurn: async () => {
    const state = get()

    // Can't undo if there are no messages or only the greeting
    if (state.messages.length <= 1) {
      console.log('Cannot undo: no conversation turns to undo')
      return
    }

    try {
      set({ isGeneratingQuestions: true, error: null })

      // Find the last user message and remove it along with any AI responses after it
      const messages = [...state.messages]
      let lastUserIndex = -1

      // Find the last user message (excluding the greeting)
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].isUser) {
          lastUserIndex = i
          break
        }
      }

      if (lastUserIndex === -1) {
        console.log('Cannot undo: no user messages found')
        return
      }

      // Remove all messages from the last user message onwards
      const updatedMessages = messages.slice(0, lastUserIndex)

      // Update state with the trimmed messages
      set({ messages: updatedMessages })

      // Reset win condition if it was achieved
      if (state.hasWon) {
        set({ hasWon: false })
      }

      // Generate new questions based on the updated conversation history
      await state.generateFollowUpQuestions()

      console.log(`Undid conversation turn. Messages reduced from ${messages.length} to ${updatedMessages.length}`)

    } catch (error) {
      console.error('Error undoing last turn:', error)
      state.setError(error instanceof Error ? error.message : 'Failed to undo last turn')
    } finally {
      set({ isGeneratingQuestions: false })
    }
  }
}))

export type { ChatMessage, GameConfig, QuestionOption }