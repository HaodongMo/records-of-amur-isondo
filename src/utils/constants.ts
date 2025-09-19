import { GameLevel, PersonaTag } from '../types'

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Learn about the Records of Amur Isondo',
    question: 'What are the basic principles of artificial intelligence?',
    unlocked: true,
    completed: false
  },
  {
    id: 'level1',
    title: 'The Nature of Knowledge',
    description: 'Explore how information becomes wisdom',
    question: 'How do humans learn differently from machines?',
    unlocked: false,
    completed: false
  },
  {
    id: 'level2',
    title: 'Simulated Conversations',
    description: 'Understand the art of dialogue',
    question: 'What makes a conversation feel natural and engaging?',
    unlocked: false,
    completed: false
  }
]

export const PERSONA_TAGS: PersonaTag[] = [
  // Personality traits
  { id: 'curious', name: 'Curious', description: 'Loves asking questions', category: 'personality' },
  { id: 'wise', name: 'Wise', description: 'Speaks with ancient knowledge', category: 'personality' },
  { id: 'playful', name: 'Playful', description: 'Approaches topics with humor', category: 'personality' },
  { id: 'methodical', name: 'Methodical', description: 'Takes systematic approaches', category: 'personality' },

  // Expertise areas
  { id: 'scientist', name: 'Scientist', description: 'Expert in research and analysis', category: 'expertise' },
  { id: 'philosopher', name: 'Philosopher', description: 'Deep thinker about existence', category: 'expertise' },
  { id: 'teacher', name: 'Teacher', description: 'Skilled at explaining concepts', category: 'expertise' },
  { id: 'artist', name: 'Artist', description: 'Creative and expressive', category: 'expertise' },

  // Communication styles
  { id: 'poetic', name: 'Poetic', description: 'Speaks in metaphors and imagery', category: 'style' },
  { id: 'direct', name: 'Direct', description: 'Gets straight to the point', category: 'style' },
  { id: 'storyteller', name: 'Storyteller', description: 'Explains through narratives', category: 'style' },

  // Background contexts
  { id: 'ancient', name: 'Ancient', description: 'From a bygone era', category: 'background' },
  { id: 'modern', name: 'Modern', description: 'Contemporary perspective', category: 'background' },
  { id: 'futuristic', name: 'Futuristic', description: 'Forward-thinking vision', category: 'background' }
]

export const BANNED_WORDS = [
  // Add content filtering words here
  'inappropriate',
  'harmful'
]

export const MAX_SELECTED_TAGS = 4
export const MAX_CHAT_HISTORY = 50