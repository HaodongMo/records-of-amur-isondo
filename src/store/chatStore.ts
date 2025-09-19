import { create } from 'zustand'
import Cookies from 'js-cookie'
import { openRouterService } from '../lib/openrouter'

interface ChatMessage {
  id: number
  sender: 'FLAME' | 'USER'
  text: string
  isUser: boolean
}

interface GameConfig {
  persona: string
  question: string
  targetTopic: string
  context?: string
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

  // Actions
  setApiKey: (key: string) => void
  clearApiKey: () => void
  setConfig: (config: Partial<GameConfig>) => void
  addMessage: (message: Omit<ChatMessage, 'id'>) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setQuestionOptions: (options: QuestionOption[]) => void

  // LLM Actions
  sendUserMessage: (message: string) => Promise<void>
  initializeApiKey: () => Promise<void>
  loadApiKeyFromCookie: () => void
  generateInitialQuestions: () => Promise<void>
  generateFollowUpQuestions: () => Promise<void>
}

const API_KEY_COOKIE = 'openrouter_api_key'

export const useChatStore = create<ChatState>((set, get) => ({
  apiKey: null,
  config: {
    persona: 'a WWI soldier who fought in the trenches of the Western Front. You have firsthand experience of the war and strong opinions about its causes and conduct.',
    question: "Who's responsible for starting WWI?",
    targetTopic: 'WWI responsibility and causes',
    context: 'This is an educational discussion about the complex causes and responsibility for World War I.'
  },
  messages: [],
  questionOptions: [],
  isLoading: false,
  isGeneratingQuestions: false,
  hasWon: false,
  error: null,

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

  setConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  })),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),

  clearMessages: () => set({ messages: [], hasWon: false }),

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
        message,
        state.config.context
      )

      // Add AI response
      state.addMessage({
        sender: 'FLAME',
        text: answer,
        isUser: false
      })

      // Step 2: Evaluate if the question was answered
      const isAnswered = await openRouterService.evaluateAnswer(
        state.config.question,
        answer,
        state.config.targetTopic
      )

      console.log('Question answered adequately:', isAnswered)

      // Check for win condition
      if (isAnswered && !state.hasWon) {
        set({ hasWon: true })
        alert(`🎉 Congratulations! You've successfully learned about ${state.config.targetTopic}!\n\nYou can continue the conversation or start a new topic.`)
      }

      // Step 3: If not answered adequately, generate follow-up
      if (!isAnswered) {
        const followUp = await openRouterService.generateFollowUp(
          state.config.persona,
          state.config.question,
          answer,
          state.config.context
        )

        // Add follow-up response
        state.addMessage({
          sender: 'FLAME',
          text: followUp,
          isUser: false
        })
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

      // Convert messages to ChatMessage format for the API
      const chatHistory: import('../lib/openrouter').ChatMessage[] = state.messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }))

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
  }
}))

export type { ChatMessage, GameConfig, QuestionOption }