import { create } from 'zustand'
import Cookies from 'js-cookie'
import { openRouterService } from '../lib/openrouter'

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

  // Actions
  setApiKey: (key: string) => void
  clearApiKey: () => void
  setConfig: (config: Partial<GameConfig>) => void
  setCharacterName: (name: string) => void
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
    persona: 'the Egyptian God, Anubis, who is wise, mysterious, and speaks in riddles.',
    question: "What is the significance of the afterlife in ancient Egyptian culture?",
    targetTopic: 'Ancient Egyptian beliefs about the afterlife',
    context: 'This is an educational discussion about ancient Egyptian mythology and culture.',
    validationCriteria: [
      'Explains the importance of the afterlife in ancient Egyptian religion',
      'Mentions specific Egyptian gods or concepts related to death',
      'Describes Egyptian burial practices or mummification',
      'Discusses the journey of the soul after death'
    ]
  },
  messages: [],
  questionOptions: [],
  isLoading: false,
  isGeneratingQuestions: false,
  hasWon: false,
  error: null,
  isInitialized: false,
  isInitializing: false,
  characterName: 'Anubis',

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
      characterName
    }
  }),

  setCharacterName: (name: string) => set({ characterName: name }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),

  clearMessages: () => set({ messages: [], hasWon: false, isInitialized: false, isInitializing: false }),

  resetGameState: () => set({
    messages: [],
    questionOptions: [],
    isLoading: false,
    isGeneratingQuestions: false,
    hasWon: false,
    error: null,
    isInitialized: false,
    isInitializing: false
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
        // Generate new questions in parallel since they're independent
        state.generateFollowUpQuestions()
      ])

      console.log('Question answered adequately:', isAnswered)

      // Check for win condition
      if (isAnswered && !state.hasWon) {
        set({ hasWon: true })
        alert(`🎉 Congratulations! You've successfully learned about ${state.config.targetTopic}!\n\nYou can continue the conversation or start a new topic.`)
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
        state.config.targetTopic
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
      set({ isGeneratingQuestions: true, error: null })

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
        state.config.targetTopic
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

      console.log('Starting initialization - generating greeting and questions...')

      // Generate greeting and questions in parallel to save time
      const [greeting] = await Promise.all([
        openRouterService.generateGreeting(
          state.config.persona,
          state.characterName,
          state.config.context || ''
        ),
        state.generateInitialQuestions()
      ])

      console.log('Initialization complete - adding greeting message')

      // Add greeting message to state
      state.addMessage({
        sender: state.characterName.toUpperCase(),
        text: greeting,
        isUser: false
      })

      // Mark as initialized only AFTER all API calls succeed
      set({ isInitialized: true, isInitializing: false })

    } catch (error) {
      console.error('Error initializing chat:', error)
      state.setError(error instanceof Error ? error.message : 'Failed to initialize chat')
      set({ isInitializing: false })
    }
  }
}))

export type { ChatMessage, GameConfig, QuestionOption }