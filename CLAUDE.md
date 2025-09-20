# The Records of Amur Isondo - Claude Code Configuration

## Project Overview
Educational Generative AI Game built as a React WebApp. Players select educational levels, create custom AI "guide" personas through tag selection, and engage in conversations to learn about specific topics. The game teaches the concept of "AI as Simulators" through hands-on experimentation with different historical and cultural perspectives.

## Architecture
- Self-contained React web application with TypeScript
- OpenRouter API integration for LLM functionality
- Zustand state management for chat and game state
- Browser cookie storage for API keys and progress
- Custom CSS with backdrop filters and animations
- Level-based progression system with 100 educational topics

## Current Implementation Status

### ✅ Completed Features
1. **Level Selection System** - 100 educational levels (beginner/intermediate/advanced)
2. **Persona Creation** - Tag-based character creation with 7 categories
3. **Chat Interface** - Real-time conversation with AI guides
4. **Victory System** - Automatic level completion detection and celebration
5. **Progress Tracking** - Level unlocking and completion persistence
6. **Navigation Flow** - Consistent routing between levels/personas/chat
7. **Question Generation** - Smart questions that adapt after 5 turns
8. **Undo Functionality** - Reverse conversation turns
9. **Content Filtering** - PG-13 safety measures

### 🏗️ Architecture Details
- **Pages**: HomePage, LevelSelection, PersonaCreation, ChatPage, Victory
- **State**: chatStore (conversations), gameStore (level progress)
- **API**: OpenRouter service with prompt engineering
- **Styling**: Custom CSS with game-like visual design

## Development Commands

### Setup & Installation
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Development
```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Dependencies Installed
```bash
# Core
npm install @types/react @types/react-dom

# Routing & State
npm install react-router-dom @types/react-router-dom zustand

# Storage & API
npm install js-cookie @types/js-cookie axios
```

## User Flow

### 1. Level Selection (LevelSelection.tsx)
- Grid of 100 numbered levels with difficulty indicators
- Click level → see description, research question, and tag selection tips
- "Begin Journey" → navigate to persona creation for that level

### 2. Persona Creation (PersonaCreation.tsx)
- Research question displayed from selected level
- Floating tags from 7 categories (time periods, professions, cultures, etc.)
- Select up to 5 tags → AI generates custom persona matching those traits
- "Continue to Chat" → navigate to conversation

### 3. Chat Interface (ChatPage.tsx)
- Level indicator and research question in header
- Conversation with custom AI guide character
- 3 smart question options generated dynamically
- After 5 turns, questions guide toward answering research question
- Controls: New Q's, Undo, New Persona, Levels, Config

### 4. Victory Screen (Victory.tsx)
- Celebration animation when level objective met
- Options: Continue Conversation, Next Level, Back to Levels
- Automatic progress saving and level unlocking

## Game Mechanics

### Level System
- **100 Educational Levels** covering diverse topics
- **Progressive Difficulty** (beginner → intermediate → advanced)
- **Unlock Dependencies** - complete prerequisites to access new levels
- **Completion Tracking** - persistent progress across sessions

### Persona Creation
- **7 Tag Categories**: Time Periods, Professions, Cultural Origins, Social Classes, Personality Traits, Animals, Objects
- **AI Generation** - custom personas based on selected tag combinations
- **Historical Accuracy** - characters represent authentic perspectives
- **Creative Combinations** - unexpected but sensible persona mixing

### Question Intelligence
- **Initial Questions** - open exploration of topic
- **Turn 5+ Enhancement** - questions guide toward research question
- **Context Awareness** - builds on previous conversation
- **Variety** - always 3 diverse options to choose from

## Safety & Content Guidelines
- **PG-13 Content Filtering** throughout all AI interactions
- **Historical Accuracy** - characters limited to their time period knowledge
- **Educational Focus** - conversations guided toward learning objectives
- **Prompt Engineering** - carefully crafted system prompts for appropriate responses

## File Organization
```
src/
├── pages/
│   ├── HomePage.tsx          # Landing page with Start Learning
│   ├── LevelSelection.tsx    # 100 level grid with details panel
│   ├── PersonaCreation.tsx   # Tag selection and persona generation
│   ├── ChatPage.tsx          # Main conversation interface
│   └── Victory.tsx           # Level completion celebration
├── store/
│   ├── chatStore.ts          # Conversation state and AI interactions
│   └── gameStore.ts          # Level progress and game state
├── lib/
│   └── openrouter.ts         # AI service integration
└── assets/
    └── background.webp       # Shared background image
```

## Current State
The application is fully functional with a complete educational game loop. Players can select from 100 levels, create custom AI guide personas, engage in meaningful conversations, and track their learning progress. The system intelligently guides conversations toward educational objectives while maintaining engaging, character-driven interactions.